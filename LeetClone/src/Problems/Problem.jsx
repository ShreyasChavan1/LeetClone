import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Split from '@uiw/react-split';
import Editor from '@monaco-editor/react';
import './Problem.css'
import Description from './Description';
import Code_setting from './Code_setting';
import TestCases from './TestCases';
import { Mycontext } from '../conf/context';
import Submissions from './Submissions';
import { useParams } from 'react-router-dom';


const Problem = () => {
  const { navBar,setProblem } = useContext(Mycontext);
  const [submissions, setSubmissions] = useState(false);
  const {id} = useParams();

  useEffect(()=>{
    fetch(`http://localhost:4000/Problem/${id}`)
    .then(response => response.json())
    .then(data => setProblem(data));
  },[id]);
  
  return (
    <div className='h-screen flex flex-col'>
      {navBar && <Navbar />}
      <div className='bg-[#1A1A1A] h-[93vh] flex flex-col flex-1 overflow-y-hidden overflow-x-hidden'>
        <Code_setting setSubmissions={setSubmissions} submissions={submissions} />
        <Split renderBar={({ onMouseDown, ...props }) => {
          return (
            <div {...props} style={{ boxShadow: 'none', background: 'transparent' }}>
              <div onMouseDown={onMouseDown} style={{ backgroundColor: '#0000004d', boxShadow: 'none' }} />
            </div>
          );
        }} >
          <div className="w-full p-5 rounded-xl overflow-y-scroll hide-scrollbar">
            {submissions ? <Submissions /> : <Description />}
          </div>
          <div className="w-full h-full rounded-xl">
            <Split mode="vertical" renderBar={({ onMouseDown, ...props }) => {
              return (
                <div {...props} style={{ boxShadow: 'none', background: 'transparent' }}>
                  <div onMouseDown={onMouseDown} style={{ backgroundColor: '#0000004d', boxShadow: 'none' }} />
                </div>
              );
            }}>
              <div className="w-full h-full">
                <Editor
                  height="100%"
                  width="100%"
                  defaultLanguage="javascript"
                  theme="vs-dark"
                  options={{ fontSize: 14, minimap: { enabled: false } }}
                />
              </div>
              <TestCases />
            </Split>
          </div>
        </Split>
      </div>
    </div>
  )
}

export default Problem


