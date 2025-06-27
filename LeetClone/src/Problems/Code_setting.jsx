import React, { useContext } from 'react'
import { Mycontext } from '../conf/context'

const Code_setting = ({setSubmissions,submissions}) => {
  const {setNavBar,navBar} = useContext(Mycontext)
  return (
     <div className="h-[7vh] bg-[#242424] text-white px-4 flex flex-row justify-between items-center m-1">
        <div className="">
          <label className={`relative mr-8 font-semibold ${submissions ? "text-gray-400" : "text-white" }`}>Problem</label>
          <label className={`font-semibold ${submissions ? "text-white" : "text-gray-400" }`} onClick={()=>setSubmissions(!submissions)}>Submissions</label>
        </div>
        <div className="">
          <i className="fa-solid fa-arrow-rotate-left cursor-pointer"></i>
          <i className="fa-solid fa-expand ml-5 cursor-pointer" onClick={()=>setNavBar(!navBar)}></i>
        </div>
    </div>
  )
}

export default Code_setting