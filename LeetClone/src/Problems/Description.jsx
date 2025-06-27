import React, { useContext } from 'react'
import { Mycontext } from '../conf/context'

const Description = () => {
  const {problem} = useContext(Mycontext);
  return (
    <div className='text-white'>
      <label className='text-3xl font-semibold'>{problem.title}</label>
      <br/><br />
      <label className={`text-xl font-semibold ${problem.difficulty === "Easy" ?"text-green-500":
             problem.difficulty === "Medium" ? "text-yellow-400": 
             "text-red-500" }`}>{problem.difficulty}</label>
      <p className='mt-12 mb-10'>
        {problem.description}
      </p>
      <label className='text-xl font-semibold'>Example</label>
      <div className='bg-[#2c2c2c]  mt-3 p-5 mb-3'>
      <pre>
        Input: nums = [1, 2, 3, 3],

        Output: true
        </pre>
      </div>
      <label className='text-xl font-semibold'>Example 2</label>
      <div className='bg-[#2c2c2c] mt-3 p-5'>
        <pre>
        Input: nums = [1, 2, 3, 3],
        Output: true
        </pre>
      </div>
      </div>

  )
}

export default Description