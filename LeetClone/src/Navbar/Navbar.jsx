import React, { useContext } from 'react'
import Leet from '../assets/leet.png';
import { Link,useLocation, useNavigate } from 'react-router-dom';
import { Mycontext } from '../conf/context';
import { auth } from '../conf/config';
import { signOut } from 'firebase/auth';
const Navbar = () => {
  const { pathname } = useLocation();
  const{currentuser,setCurrentuser} = useContext(Mycontext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentuser(null); 
      navigate('/'); 
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };
  return (
    <div className="bg-[#282828] h-[7vh] text-x1 text-stone-400 font-medium flex  flex-row justify-between">
        <ul className='flex flex-row space-x-10 mt-3 mx-50'>
            <li><img src={Leet} /></li>
            <li className={`hover:text-amber-50 cursor-pointer ${pathname === "/Profile" ? "text-white" : ""}`}>
              <Link to='/Profile'>Profile</Link></li>
            <li className={`hover:text-amber-50 cursor-pointer ${pathname === "/Problems" ? "text-white" : ""}`}>
              <Link to='/Problems'>Problems</Link></li>
        </ul>


        <ul className='flex flex-row space-x-4 mt-3 mx-50'>
        <li>
          <img src={currentuser.avatar} alt="avatar" className='rounded-xl h-8' />
        </li>
            <li className=''><button className='text-amber-400 hover:text-amber-500 text-sm  bg-[#ffaa0036] rounded-md p-1.5 font-semibold'>Subscribe</button></li>
            <li><i onClick={handleLogout} className="fa-solid fa-right-from-bracket mt-2 text-teal-50"></i></li>
        </ul>
    </div>
  )
}

export default Navbar;