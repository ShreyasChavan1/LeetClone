import './App.css'
import Profile from './Profile Page/Profile'
import { useContext } from 'react'
import { Mycontext } from './conf/context'
import Signup from './Signup/Signup'
import Problems from './Problems/Problems'
import Problem from './Problems/Problem'
import { Routes,Route, Navigate } from 'react-router-dom'

function Privateroute({children}){
  const {currentuser} = useContext(Mycontext);
  return currentuser ? children : <Navigate to='/'/>;
}
function App() {
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
