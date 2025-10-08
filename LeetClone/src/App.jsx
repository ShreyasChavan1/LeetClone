import './App.css'
import Profile from './Profile Page/Profile'
import { useContext } from 'react'
import { Mycontext } from './conf/context'
import Signup from './Signup/Signup'
import Problems from './Problems/Problems'
import Problem from './Problems/Problem'
import { Routes,Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { auth } from './conf/config'

function Privateroute({children}){
  const {currentuser} = useContext(Mycontext);
  return currentuser ? children : <Navigate to='/'/>;
}
//this wrapper checks if user is logged in or not , if not then sends back to login page
function App() {
  const {currentuser,setProblems,setAllsubmissions,setSolvedQuestions} = useContext(Mycontext);
  useEffect(()=>{
    const getdata = async() =>{
        if (!auth.currentUser) return;
        const token = await auth.currentUser.getIdToken();
        const fetchwithauth = async(url) =>{
          const res = await fetch(url,{
            method:'GET',
            headers:{
              'Content-Type':'application/json',
              'Authorization':`Bearer ${token}`
            }
          })
          return res.json()
        }
        const problems = await fetchwithauth("http://localhost:4000/Problems");
        setProblems(problems);
      };


      getdata()
  },[currentuser])
  return (
    <>
      <Routes>
        <Route path='/' element={<Signup/>}/>
        <Route path='/Problems' element={<Privateroute><Problems/></Privateroute>}/>
        <Route path='/Problem/:title' element={<Privateroute><Problem/></Privateroute>}/>
        <Route path='/Profile' element={<Profile><Problems/></Profile>}/>
      </Routes>
    </>
  )
}

export default App
