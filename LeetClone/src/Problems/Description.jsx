import React, { useContext } from 'react'
import { Mycontext } from '../conf/context'

const Description = () => {
  const { problem } = useContext(Mycontext);
  return (
    <div className='text-white'>
      <label className='text-3xl font-semibold'>{problem.title}</label>
      <br /><br />
      <label className={`text-xl font-semibold ${problem?.difficulty === "Easy" ? "text-green-500" :
          problem?.difficulty === "Medium" ? "text-yellow-400" :
            "text-red-500"
        }`}>{problem.difficulty}</label>

      <div className='mt-12 mb-10 text-white text-base leading-relaxed'>
        {problem?.description?.split('\n').map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {problem.examples?.map((example, ind) => (
          <div key={ind}>
            <label className="text-xl font-semibold block mb-2">Example {ind + 1}</label>
            <div className="bg-[#2c2c2c] p-5 rounded-md overflow-auto hide-scrollbar">
              <p><strong>input:</strong> {example.input}</p>
              <p><strong>output:</strong> {example.output}</p>
            </div>
          </div>
        ))}
      </div>
    </div>


  )
}

export default Description