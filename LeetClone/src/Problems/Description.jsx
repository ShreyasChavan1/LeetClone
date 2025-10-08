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
      <pre className='mt-12 mb-10'>
        {problem.description}
      </pre>

      
      <div className="flex flex-wrap">
  {problem.examples?.map((example, ind) => (
    <div key={ind} className="w-fit">
      <label className="text-xl font-semibold block mb-2">Example {ind + 1}</label>
      <div className="bg-[#2c2c2c] p-5 mb-3 rounded-md overflow-auto flex flex-wrap">
        <pre>
input: {example.input}</pre>
<pre>
output: {example.output}
</pre>        
      </div>
    </div>
  ))}
</div>

      </div>

  )
}

export default Description