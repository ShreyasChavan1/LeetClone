import React, { useContext, useEffect } from 'react'
import { Mycontext } from '../conf/context'

const Submissions = () => {
  const {output} = useContext(Mycontext)
  useEffect(()=>{
  },[output])

  return (
    <div>
        <div className={`bg-[#2c2c2c] text-xl font-semibold ${output ? "text-green-500": "text-red-500"} w-full p-3`}>
            {output ? "Accepted" : "Wrong Answer"}
        </div>
    </div>
  )
}

export default Submissions