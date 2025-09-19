import React, { useContext, useEffect } from 'react'
import { Mycontext } from '../conf/context'
import { auth } from '../conf/config'


const Submissions = () => {
  const {output,setAllsubmissions,allsubmissions,setCode} = useContext(Mycontext)
  useEffect(()=>{
    const getsubmission = async()=>{
      try{
        const token = await auth.currentUser.getIdToken();
        const res = await fetch("http://localhost:4000/Getsubmissions",{
          method: "GET",
          headers:{
            'Content-Type':"application/json",
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await res.json();
        setAllsubmissions(data)
        console.log(data)
      }catch(err){
        console.log("someting went wrong while getting submission "+err)
      }
    }
    getsubmission();
  },[output])

  const getsubmittedcode = async(supabasepath) =>{
    try{
      console.log(supabasepath)
      const submittedcode = await fetch(`http://localhost:4000/file/${supabasepath}/Submissions`);
      const Data = await submittedcode.json();
      console.log(Data)
    }catch(err){
      console.error("Error while getting submitted code",err)
    }
  }

  return (
    <div>
      {allsubmissions.map((submission,ind) => (
        <div key={ind}  className={`bg-[#2c2c2c] text-xl font-semibold ${submission.verdict === "Accepted" ? "text-green-500" : "text-red-500"} w-full p-3 cursor-pointer`} onClick={() => getsubmittedcode(submission.getfireurl)}>
          {submission.verdict === "Accepted" ? "Accepted" : "Wrong Answer"}
        </div>
      ))}
    </div>
  )
}

export default Submissions