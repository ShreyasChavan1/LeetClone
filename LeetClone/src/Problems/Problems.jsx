import React, { useEffect ,useState } from 'react'
import Navbar from '../Navbar/Navbar'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { Mycontext } from '../conf/context'
const Problems = () => {
  const {setProblems,problems} = useContext(Mycontext)
  

  return (
    <div className='bg-[#1A1A1A] h-[100vh] flex flex-col '>
    <Navbar/>
    <div className="bg-[#282828] h-[83vh] w-[60vw] self-center my-10 rounded-xl flex flex-col p-8 justify-around overflow-y-scroll hide-scrollbar">
      {problems.map((problem,key) => (
        <div key={key} className="bg-[#2c2c2c] w-full h-10 rounded-xl flex flex-row p-2 justify-between text-white font-semibold">
          <label className={`${problem.difficulty === "Easy" ?"text-green-500":
             problem.difficulty === "Medium" ? "text-yellow-400": 
             "text-red-500" } `}>{problem.difficulty}</label>
          <Link to={`/Problem/${problem.title}`}>{problem.title}</Link>
          <a href="https://youtu.be/KLlXCFG5TnA"><i className="fa-solid fa-video mt-1"></i></a>
        </div>
      ))}
    </div>
    </div>
  )
}

export default Problems