const fsp = require("fs").promises;
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const getfiles = require("./Supabase/getFromsupabase")
//debugged pythong problem 
const imagemap = {
  python: { image: "python-sandbox", ext: "py" ,
    cmd:(u)=> `python ${u}.solution.py < ${u}.input.txt > ${u}.user_output.txt 2> ${u}.error.txt`
  },
  cpp: { image: "sandbox-cpp", ext: "cpp",
    cmd:(u)=> `g++ ${u}.solution.cpp -o ${u}.solution 2> ${u}.error.txt && ./${u}.solution < ${u}.input.txt > ${u}.user_output.txt 2>> ${u}.error.txt`,
   },
  java: { image: "sandbox-java", ext: "java",
    cmd:(u)=> `javac ${u}.solution.java 2> ${u}.error.txt && java -cp . solution < ${u}.input.txt > ${u}.user_output.txt 2> ${u}.error.txt`
  },
  js: { image: "sandbox-js", ext: "js",
    cmd:(u)=> `node ${u}.solution.js < ${u}.input.txt > ${u}.user_output.txt 2> ${u}.error.txt`
  }
};

const EXECUTER_BOX = "/judge_work_dir";
const SANDBOX = "/sandbox_exec_dir";
//to run dockercommand
function runDockercommand(args,errorr){
    let child;
    const  Dockerprocess =  new Promise((resolve)=>{
        console.log("Running Spawn: ")
        try{
          child = spawn("docker",args);
          console.log("command worked fine")//temp one
        }catch(err){
          console.log("Failed to spawn docker process ",err);
          resolve({err});
        }
        let output ="";let erro = ""
        child.stdout.on("data", d=> output += d);
        child.stderr.on("data", err=> erro+= err);
        console.log("checking if there is error in dockercommand ",erro);
        child.on("error",(spawnerr)=>{
          console.error("Docker spawn command failed:", spawnerr);
          resolve({error:`Exitt code : ${spawnerr}`})
        })
        child.on("close", (code) => {
          if(code === 0){
            resolve({output});
          }else{
            if(fs.existsSync(errorr)){
              const er = fs.readFileSync(errorr,"utf8");
              resolve({error:er});
            }
            else{
              console.error(`exited with ${code} can be ${erro}`)
              resolve({error:erro || `Docker command exited with code ${code}`})
            }
          }
        });
      }
    )


    const timeoutprocess = new Promise((resolve)=>{
      setTimeout(()=>{
        child.kill("SIGTERM");
        resolve({error : `Time Limit Exceeded`})
      },20000)
    })
    return Promise.race([Dockerprocess,timeoutprocess]);
}


function normalize(str){
  return str.replace(/\r\n/g,'\n')
  .replace(/\s+$/gm,'')
  .trim();
}

// for comparison of expected and useroutput
function compareOutput(useroutput,expeced){
    return new Promise((resolve,reject)=>{
      let r1 = fs.createReadStream(useroutput);
      let r2 = fs.createReadStream(expeced);
      let bf1 = "", bf2 = "",resolved = false,ended1 = false,ended2 = false;
    
      r1.on("data",data => bf1 += data);
      r2.on("data",data => bf2 += data);
      r1.on("error",(readerr)=>{
        reject(readerr)
      })
      r2.on("error",(readerr)=>{
        reject(readerr)
      })
      
      const createcompare = () => {
        if(ended1 && ended2 && !resolved){
          resolved = true;
          const u = normalize(bf1);
          // console.log(bf1)
          const v = normalize(bf2);
          // console.log(bf2)
          resolve({
            verdict:u === v,
            user:u,
            expected:v
          })
        }
      }

      r1.on("end" ,()=> {ended1 = true;createcompare()});
      r2.on("end", ()=> {ended2 = true;createcompare()});
    })
}
// for cleanup
function cleanfiles(filestoclean){
  filestoclean.forEach( file=>{
    try{
      if(fs.existsSync(file)){
         fs.unlinkSync(file);
      }
    }catch(err){
      console.error(`error deleting ${file}`, err);
    }
  })
}
const runCode =  async (code,language,prob,subID) => {
  const config = imagemap[language];
  if (!config) return { error: "unsupported language" };
  const slug = prob.replace(/\s+/g, '_');

  // ensureDirExists(EXECUTER_BOX);
  const uniqueprefix = `submission-${subID}`
  const filename = `${uniqueprefix}.solution.${config.ext}`;
  const filepath = path.join(EXECUTER_BOX, filename).replace(/\\/g, "/");
  const errorr = path.join(EXECUTER_BOX,`${uniqueprefix}.error.txt`).replace(/\\/g, "/");
  const useroutputfile = path.join(EXECUTER_BOX,`${uniqueprefix}.user_output.txt`).replace(/\\/g, "/");
  const inputfile = path.join(EXECUTER_BOX,`${uniqueprefix}.input.txt`).replace(/\\/g, "/");
  const outputfile = path.join(EXECUTER_BOX,`${uniqueprefix}.output.txt`).replace(/\\/g, "/");

  const filestoclean = [
    filepath,errorr,useroutputfile,inputfile,outputfile
  ]
  const Result = {
    
    verdict : "Error",
    useroutput : "",
    expected : "",
    RunTimeError : "",
  }
  try{
    const inputcontent = await getfiles("Submissions",`${slug}/${slug}_input.txt`);
    const outputcontent = await getfiles("Submissions",`${slug}/${slug}_output.txt`);
    if(!inputcontent || !outputcontent){
      return {verdic:"Error",useroutput:"Somemthing when wrong while fetching input and output",expected:""}
    }

    // Ensure the directory exists
    fs.writeFileSync(filepath, code);
    fs.writeFileSync(useroutputfile,"")
    fs.writeFileSync(errorr,"");
    fs.writeFileSync(inputfile,inputcontent);
    fs.writeFileSync(outputfile,outputcontent);

    const commandtorun = config.cmd(uniqueprefix);
    let run;
      run = await runDockercommand([
        "run","--rm",
        "--network=none","-m","512m","--cpu-shares","512",
        "-v" ,`leetcode_clone_judge_temp_data:${SANDBOX}`,
        "-w" ,`${SANDBOX}`,
        `${config.image}`,
        "bash","-c",
        commandtorun,
      ],errorr)

    console.log("Code Execution in sandbox completed , Now checking if result Correct or NOt")
    let compare;
    if(run.error){
      Result.verdict = run.error.includes("Timeout") ? "Time Limit Exceeded" : "Error";
      Result.useroutput = run.error;
      Result.RunTimeError = "Error in Sandbox" + run.error;
      console.error("Error after execution ",run.error)
      return Result;
    }else{
      try{
        if(fs.existsSync(useroutputfile)){
            const stats = fs.statSync(useroutputfile)
            if(stats.size === 0){
              console.log("file is empty")
            }else{
              console.log("file has content")
            }
        }else{
          console.log("file does not exist")
        }
        compare = await compareOutput(useroutputfile,outputfile);
        Result.expected = compare.expected
        Result.useroutput = compare.user;
        // console.log(compare.user+" u")
        // console.log(compare.expected+" e")
        if(compare.verdict){
          Result.verdict = "Accepted";
        }else{
          Result.verdict = "Wrong Answer"
        }
      }catch(err){
        console.error("Error in evaluation "+err)
        Result.verdict = "Error"
        Result.RunTimeError = "Error in evaluation" + err
      }
    }
    console.log("Returned response back to exectuer")
    return Result;
  }catch(err){
    console.error("Error in runner file ",err.message);
    Result.verdict = "Error"
    Result.RunTimeError = `Failed execution for ${subID}`
    return Result
  }
  finally{
    cleanfiles(filestoclean);
  }
};


module.exports = runCode;

