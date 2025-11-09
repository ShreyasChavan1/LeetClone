import React, { useEffect ,useState } from 'react'
import Navbar from '../Navbar/Navbar'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { Mycontext } from '../conf/context'
const Problems = () => {
  const {setProblems,problems} = useContext(Mycontext)
  

return (
  <div className="bg-[#1A1A1A] h-[100vh] flex flex-col">
    <Navbar />
    <div className="bg-[#282828] h-[83vh] w-full sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-[60vw] self-center my-5 sm:my-10 rounded-xl flex flex-col p-4 sm:p-6 md:p-8 justify-around overflow-y-scroll hide-scrollbar">
      {problems.map((problem, key) => (
        <div
          key={key}
          className="bg-[#2c2c2c] w-full h-10 rounded-xl flex flex-row p-2 justify-between items-center text-white font-semibold mb-2"
        >
          <span
            className={
              problem.difficulty === "Easy"
                ? "text-green-500"
                : problem.difficulty === "Medium"
                ? "text-yellow-400"
                : "text-red-500"
            }
          >
            {problem.difficulty}
          </span>

          <Link to={`/Problem/${problem.title}`} className="hover:underline">
            {problem.title}
          </Link>

          {problem.answer && (
            <a
              href={problem.answer}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white"
            >
              <i className="fa-solid fa-video mt-1"></i>
            </a>
          )}
        </div>
      ))}
    </div>
  </div>
);
}

export default Problems