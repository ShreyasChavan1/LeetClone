const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const imagemap = {
  python: { image: "python-sandbox", ext: "py" ,cmd:""},
  cpp: { image: "sandbox-cpp", ext: "cpp",cmd:"bash -c g++ /app/solution.cpp -o /app/solution" },
  java: { image: "sandbox-java", ext: "java",cmd:"" },
  js: { image: "sandbox-js", ext: "js",cmd:"" }
};

//here added try catch block
function runDockercommand(args,errorr){
    let child;
    const Dockerprocess =  new Promise((resolve)=>{
      console.log("Running Spawn: ")
      child = spawn("docker",args);
      let output ="";let error = ""
      child.stdout.on("data", d=> output += d);
      child.stderr.on("data", err=> error+= err);
      child.on("error",(spawnerr)=>{
        resolve({error:`Exitt code ${code}: ${spawnerr}`})
      })
      child.on("close", (code) => {
        if(code === 0){
          resolve({output});
        }else{
          if(fs.existsSync(errorr)){
            const er = fs.readFileSync(errorr,"utf8");
            resolve({error:er});
          }
        }
      });
    })

    const timeoutprocess = new Promise((resolve)=>{
      setTimeout(()=>{
        child.kill("SIGTERM");
        resolve({error : `Process Timeout Maybe infinite loop ?`})
      },200000)
    })
    return Promise.race([Dockerprocess,timeoutprocess]);
}
function normalize(str){
  return str.replace(/\r\n/g,'\n')
  .replace(/\s+$/gm,'')
  .trim();
}
function compareOutput(useroutput,expeced){
    return new Promise((resolve,reject)=>{
      let r1 = fs.createReadStream(useroutput);
      let r2 = fs.createReadStream(expeced);
      let bf1 = "", bf2 = "",resolved = false,ended1 = false,ended2 = false;
    
      r1.on("data",data => bf1 += data);
      r2.on("data",data => bf2 += data);
//here
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
          const v = normalize(bf2);
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
const runPythonCode =  async (code, language,prob,mode = "Hidden") => {
  const config = imagemap[language];
  if (!config) return { error: "unsupported language" };
  const filename = `sandbox-${prob}.${config.ext}`;
  const filepath = path.join(__dirname, filename).replace(/\\/g, "/");
  fs.writeFileSync(filepath, code);
  
  const slug = prob.replace(/\s+/g, '_');
  const dirr = path.resolve(__dirname, `backend/Probllems/${slug}/${mode}`);
  const inputfile = path.join(dirr,`${slug}_input.txt`).replace(/\\/g, "/");
  const outputfile = path.join(dirr,`${slug}_output.txt`).replace(/\\/g, "/");
  //log and error file directly from dockerd
  const log = path.join(dirr,"log.txt").replace(/\\/g, "/");
  const errorr = path.join(dirr,"error.txt").replace(/\\/g, "/");
  const useroutput = path.join(dirr,`user_output_${Date.now()}.txt`).replace(/\\/g, "/");
  fs.writeFileSync(useroutput,"")
  fs.writeFileSync(log,"");
  fs.writeFileSync(errorr,"");

  //here
  let run;
    run = await runDockercommand([
      "run", "--rm",
      "-v",`${filepath}:/app/solution.${config.ext}`,
      "-v",`${inputfile}:/app/input.txt`,
      "-v",`${useroutput}:/app/output.txt`,
      "-v",`${log}:/app/log.txt`,
      "-v",`${errorr}:/app/error.txt`,
      `${config.image}`,
    ],errorr)

//here
  let comparison;
  try{
    comparison = await compareOutput(useroutput,outputfile);
  }catch(err){
    console.log("Error in reading output files : ",err);
  }

//changes made
console.log("DEBUG comparison:", comparison);
let verdic = "";
if(comparison){
  verdic = comparison.verdict ? "Accepted" : run.error ? run.error : "Wrong Answer"
}else{
  verdic = "there is something wrong"
}

  console.log("verdict:",verdic)
  fs.unlinkSync(filepath)
  fs.unlinkSync(useroutput)
  fs.unlinkSync(errorr)
  fs.unlinkSync(log)
  return {
    verdic,
    useroutput : comparison.user,
    expected : comparison.expected
  }
};

module.exports = runPythonCode;