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
  <div className="bg-[#282828] h-[7vh] text-sm sm:text-base md:text-lg text-stone-400 font-medium flex flex-row justify-between items-center px-2 sm:px-4 md:px-6 lg:px-10">
    
 
    <ul className="flex flex-row justify-around space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-10 mt-2 sm:mt-0">
      <li>
        <img src={Leet} alt="Logo" className="h-4 sm:h-6 md:h-8" />
      </li>
      <li className={`hover:text-amber-50 cursor-pointer ${pathname === "/Profile" ? "text-white" : ""}`}>
        <Link to='/Profile'>Profile</Link>
      </li>
      <li className={`hover:text-amber-50 cursor-pointer ${pathname === "/Problems" ? "text-white" : ""}`}>
        <Link to='/Problems'>Problems</Link>
      </li>
    </ul>
 
    <ul className="flex flex-row items-center space-x-1 sm:space-x-2 md:space-x-3 mt-2 sm:mt-0">
      <li>
        <img src={currentuser.avatar} alt="avatar" className='rounded-xl h-6 sm:h-8' />
      </li>
      <li>
        <button className='text-amber-400 hover:text-amber-500 text-xs sm:text-sm bg-[#ffaa0036] rounded-md px-2 py-1 sm:px-3 py-1 font-semibold'>
          Subscribe
        </button>
      </li>
      <li>
        <i onClick={handleLogout} className="fa-solid fa-right-from-bracket text-sm sm:text-base text-teal-50 cursor-pointer"></i>
      </li>
    </ul>

  </div>
);

}

export default Navbar;