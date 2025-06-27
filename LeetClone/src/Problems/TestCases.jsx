import React from 'react'
import { useState } from 'react'
const TestCases = () => {
  const [Cases, setCases] = useState("Case1");

  return (
    <div className="h-full p-4 bg-[#202020] text-white">
      <div className="grid grid-cols-6">
        <label className='text-white text-xl font-semibold'>Test Cases</label>  
        <label className='text-white ml-10 text-xl font-semibold col-span-3'>Output</label>
        <button className='bg-[#2d2d2d] p-2 rounded-xl font-semibold cursor-pointer'>Run</button>
        <button className='bg-green-600 p-2 rounded-xl font-semibold w-20 ml-2 cursor-pointer'>Submit</button>
      </div>
      <hr className='mt-3'/> 
      <div className="h-full w-full mt-3">
            <div className="flex flex-row w-full mb-3">
              <button className={`bg-[#2d2d2d] p-2 rounded-xl mr-3 ${Cases === "Case1" ? "text-white" :"text-gray-400"} cursor-pointer`} onClick={() => setCases("Case1")}>Case 1</button>
            <button className={`bg-[#2d2d2d] p-2 rounded-xl ml-2 ${Cases === "Case2"?"text-white":"text-gray-400"} cursor-pointer`} onClick={() => setCases("Case2")}>Case 2</button>

            </div>   
      
            {Cases === "Case1" ? (
  <>
    <label className='text-sm'>Nums</label>
    <div className="bg-[#2d2d2d] border border-blue-200 p-3 mb-2">[3,4,5,6]</div>
    <label className='text-sm'>Target</label>
    <div className="bg-[#2d2d2d] border border-blue-200 p-3">7</div> 
  </>
) : (
  <>
    <label className='text-sm'>Nums</label>
    <div className="bg-[#2d2d2d] border border-blue-200 p-3 mb-2">[1,2,3]</div>
    <label className='text-sm'>Target</label>
    <div className="bg-[#2d2d2d] border border-blue-200 p-3">5</div> 
  </>
)}

                 
             </div> 
    </div>
  )
}

export default TestCases