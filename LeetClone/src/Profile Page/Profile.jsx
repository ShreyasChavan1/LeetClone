import './Profile.css'
import Navbar from '../Navbar/Navbar'
import ProgressRing from './circular'
import { useContext ,useEffect, useMemo} from 'react'
import { Mycontext } from '../conf/context'
import { auth } from '../conf/config'
import { Link } from 'react-router-dom'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const Profile = () => {
  const {currentuser,problems,setSolvedQuestions,solvedQuestions} = useContext(Mycontext);
  
  useEffect(()=>{
    const getunique = async() =>{
        if(!auth.currentUser)return;
        const token = await auth.currentUser.getIdToken();
        const submissions = await fetch(`${BACKEND_URL}/Getsubmissions?frequency=Unique`,{
          method:'GET',
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${token}`
          }
        }
        )
        const data = await submissions.json()

        setSolvedQuestions(data);
    }
    getunique();
  },[auth.currentUser])
 
  const getSolved_counts = useMemo(()=>{
    if(!solvedQuestions)return {easy:0,medium:0,hard:0};
     return solvedQuestions.reduce((count,problem)=>{
      if(problem.difficulty === "Easy")count.easy++;
      else if(problem.difficulty === "Medium")count.medium++;
      else if(problem.difficulty === "Hard")count.hard++;
      return count;
    },{easy:0,medium:0,hard:0})
  },[solvedQuestions])

  const getReal_counts = useMemo(()=>{
    if(!problems)return{easy:0,medium:0,hard:0}
    return problems.reduce((count,problem)=>{
      if(problem.difficulty === "Easy")count.easy++;
      else if(problem.difficulty === "Medium")count.medium++;
      else if(problem.difficulty === "Hard")count.hard++;
      return count;
    },{easy:0,medium:0,hard:0})
  },[problems])

  let Rank = "Unranked";
  const Rakings = {
    100 : "Apprentice",
    250 : "Knight",
    500 : "Champion",
    1000 : "Archmage",
    2000 : "Grandmaster of Code"
  }
  const milestones = Object.keys(Rakings).map(Number).sort((a,b)=> a-b);

  for(let milstone of milestones){
    if(solvedQuestions.length >= milstone){
      Rank = Rakings[milstone]
    }
  }


console.log(currentuser)
  if (!currentuser || !problems || !solvedQuestions) {
    return <div>Loading...</div>; 
  }
  return (
    <div className="bg-[#1A1A1A] h-[100vh] flex flex-col">
      <Navbar/>
      <div className=" h-[33vh] mt-5 flex flex-col sm:flex-row justify-center items-center">

        <div className="bg-[#282828] h-[30vh] w-full sm:w-[23vw] md:w-[20vw] lg:w-[18vw] rounded-xl m-2 sm:m-4 flex flex-col items-center justify-center">
          <Link to='/Profile'><img className='h-20 sm:h-24 md:h-28 rounded-xl' src={currentuser.avatar} alt="" /></Link>
          <div className="mt-2 flex flex-col items-center">
            <span className='text-white text-lg sm:text-xl font-semibold'>{currentuser.name}</span>
            <span className='text-[#878787] text-xs sm:text-sm'>{currentuser.email}</span>
            <button className={`h-8 sm:h-10 w-32 sm:w-40 bg-[#3eff1722]
              ${Rank === "Grandmaster of Code" ? "text-amber-300" : "text-[#3eff17c7]"} font-semibold rounded-sm mt-1.5 cursor-pointer text-xs sm:text-sm`}>{Rank}</button>
          </div>
        </div>

        <div className="bg-[#282828] h-[30vh] w-full sm:w-[26vw] md:w-[22vw] lg:w-[20vw] rounded-xl m-2 sm:m-4 grid grid-cols-2 gap-2">
          <div className="flex items-center justify-center">
            <ProgressRing/>
          </div>
          <div className="flex flex-col justify-center space-y-1">
            <div className="bg-[#373737] h-12 sm:h-15 w-full rounded-xl text-center flex flex-col justify-center">
              <label className='text-green-500 font-semibold text-xs sm:text-sm'>Easy</label>
              <label className='text-white text-xs sm:text-sm font-semibold'>{getSolved_counts.easy}/{getReal_counts.easy}</label>
            </div>

            <div className="bg-[#373737] h-12 sm:h-15 w-full rounded-xl text-center flex flex-col justify-center">
              <label className='text-yellow-400 font-semibold text-xs sm:text-sm'>Medium</label>
              <label className='text-white text-xs sm:text-sm font-semibold'>{getSolved_counts.medium}/{getReal_counts.medium}</label>
            </div>
            <div className="bg-[#373737] h-12 sm:h-15 w-full rounded-xl text-center flex flex-col justify-center">
              <label className='text-red-400 font-semibold text-xs sm:text-sm'>Hard</label>
              <label className='text-white text-xs sm:text-sm font-semibold'>{getSolved_counts.hard}/{getReal_counts.hard}</label>
            </div>
          </div>
        </div>
      </div>
      
      {/* previously  solved */}
      <div className="bg-[#262626] h-[52vh] w-full sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-[53vw] rounded-xl mt-5 self-center p-2 sm:p-4 overflow-y-scroll hide-scrollbar">
        {solvedQuestions?.length > 0 ? (
          solvedQuestions.map((question, key) => (
            <div key={key} className="bg-[#353535] p-2 rounded-xs">
              <h2 className="text-white font-semibold ml-2">{question.name}</h2>
              <h5 className="text-gray-400 font-semibold ml-2">{question.difficulty}</h5>
            </div>
          ))
        ) : (
          <div className="bg-[#353535] p-2 rounded-xs">
            <p className='text-white font-semibold'>No questions solved yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
