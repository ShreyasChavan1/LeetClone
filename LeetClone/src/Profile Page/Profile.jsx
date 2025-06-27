import './Profile.css'
import Navbar from '../Navbar/Navbar'
import avtar from '../assets/avatar.png'
import ProgressRing from './circular'
import { useContext } from 'react'
import { Mycontext } from '../conf/context'
const Profile = () => {
  const {currentuser} = useContext(Mycontext);
  return (
    <div className="bg-[#1A1A1A] h-[100vh] flex flex-col">
      <Navbar/>
      <div className=" h-[33vh] mt-5  flex flex-row justify-center">

        {/* upper row */}
        <div className="bg-[#282828] h-[20vh] w-[23vw] rounded-xl m-4 flex flex-row">
          <img className='h-25 rounded-xl m-4' src={currentuser.avatar} alt="" />
        <div className="mt-5  h-23 flex flex-col">
          <span className='text-white text-xl font-semibold'>{currentuser.name}</span>
          <span className='text-[#878787] text-[13px]'>{currentuser.email}</span>
          <button className="h-10 w-40 bg-[#3eff1722] text-[#3eff17c7] font-semibold rounded-sm mt-1.5 cursor-pointer">Edit Profile</button>
        </div>  
        </div>

        <div className="bg-[#282828] h-[30vh] w-[26vw] rounded-xl m-4 grid grid-cols-2 ">
          <div className="m-10">
            <ProgressRing/>
          </div>
          <div className="ml-5">
            <div className="bg-[#373737] h-15 w-27 rounded-xl self-end mx-3 my-2 text-center">
              <label className='text-green-500 font-semibold text-sm'>Easy</label><br />
              <label className='text-white text-sm font-semibold'>Easy</label>
            </div>

            <div className="bg-[#373737] h-15 w-27 rounded-xl self-end mx-3 my-2 text-center">
              <label className='text-yellow-400 font-semibold text-sm'>Medium</label><br />
              <label className='text-white text-sm font-semibold'>Medium</label>
            </div>
            <div className="bg-[#373737] h-15 w-27 rounded-xl self-end mx-3 my-2 text-center">
              <label className='text-red-400 font-semibold text-sm'>Hard</label><br />
              <label className='text-white text-sm font-semibold'>Hard</label>
            </div>
          </div>
        </div>
      </div>
      
      {/* previously  solved */}
      <div className="bg-[#282828] h-[52vh] w-[53vw] rounded-xl mt-5 self-center p-8">
        <div className="">
          <h2 className="text-white font-semibold">Previously Solved</h2>
        </div>
      </div>
    </div>
  )
}

export default Profile