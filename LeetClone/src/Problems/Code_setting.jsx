import React, { useContext } from 'react'
import { Mycontext } from '../conf/context'

const Code_setting = ({setSubmissions,submissions,reset, mobileTab, setMobileTab}) => {
  const {setNavBar,navBar,language,setLanguage} = useContext(Mycontext)
  const isMobile = window.innerWidth < 768;
  return (
     <div className="h-[7vh] bg-[#242424] text-white px-4 flex flex-row justify-between items-center m-1">
        <div className="">
          {isMobile ? (
            <>
              <button className={`mr-4 font-semibold ${mobileTab === 'description' ? "text-white" : "text-gray-400"}`} onClick={()=>setMobileTab('description')}>Problem</button>
              <button className={`mr-4 font-semibold ${mobileTab === 'editor' ? "text-white" : "text-gray-400"}`} onClick={()=>setMobileTab('editor')}>Editor</button>
              <button className={`font-semibold ${mobileTab === 'testcases' ? "text-white" : "text-gray-400"}`} onClick={()=>setMobileTab('testcases')}>Test Cases</button>
            </>
          ) : (
            <>
              <label className={`relative mr-8 font-semibold ${submissions ? "text-gray-400" : "text-white" }`} onClick={()=>setSubmissions(false)}>Problem</label>
              <label className={`font-semibold ${submissions ? "text-white" : "text-gray-400" }`} onClick={()=>setSubmissions(true)}>Submissions</label>
            </>
          )}
        </div>
        <div className="">
          <select name="language" value={language} onChange={(e)=>setLanguage(e.target.value)} className='mr-2 bg-[#242424]'>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="js">Javascript</option>
          </select>
          <i className="fa-solid fa-arrow-rotate-left cursor-pointer" onClick={reset}></i>
          <i className="fa-solid fa-expand ml-5 cursor-pointer" onClick={()=>setNavBar(!navBar)}></i>
        </div>
    </div>
  )
}

export default Code_setting