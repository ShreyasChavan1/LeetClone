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

const BACKEND_URL = process.env.VITE_APP_BACKEND_URL;
const Problem = () => {
  const { navBar,setProblem ,code,setCode,language,problem,status,setStatus} = useContext(Mycontext);
  const [submissions, setSubmissions] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileTab, setMobileTab] = useState('description'); 
  const {title} = useParams();
  
  
  useEffect(()=>{
    fetch(`${BACKEND_URL}/Problem/${title}`)
    .then(response => response.json())
    .then(data => setProblem(data));
  },[title]);

  useEffect(() => {
  if (status === "Completed") {
    setSubmissions(true);
  }
}, [status]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
function getMarkers(language) {
  if (language === "python") {
    return { start: "# USER CODE START", end: "# USER CODE END" };
  }
  return { start: "// USER CODE START", end: "// USER CODE END" };
}

  function extract(template,lang){

    const currentLanguage = lang || language; 
    const {start , end} = getMarkers(currentLanguage);
    
    let extracted_start = template.indexOf(start) + start.length;
    let extracted_end = template.indexOf(end);
    
    if(extracted_start < 0 || extracted_end < 0) return template;
    return template.substring(extracted_start,extracted_end);
  }

  useEffect(() => {
  if (problem?.templates?.[language]) {
    setCode(extract(problem.templates[language]));
  }
}, [problem, language]);//use useref for instead of setcode to avoid rerender after every letter type

  function injectcode(template,usercode){
    const {start , end} = getMarkers(language);

    const startindex = template?.indexOf(start) + start.length;
    const endindex = template?.indexOf(end);

    return template?.substring(0,startindex) + "\n" + usercode + "\n" + template?.substring(endindex);
  }

  const onreset = () => {
  if (problem?.templates?.[language]) {
    setStatus("")
    setCode(extract(problem.templates[language]));
  }
};


  if (isMobile) {
    return (
      <div className='h-screen flex flex-col'>
        {navBar && <Navbar />}
        <div className='bg-[#1A1A1A] h-[93vh] flex flex-col flex-1 overflow-y-hidden overflow-x-hidden min-h-0'>
          <Code_setting setSubmissions={setSubmissions} submissions={submissions} reset={onreset} mobileTab={mobileTab} setMobileTab={setMobileTab}/>
          <div className="flex-1 overflow-y-auto">
            {mobileTab === 'description' && (
              <div className="w-full p-5 rounded-xl overflow-y-scroll hide-scrollbar">
                {submissions ? <Submissions extract={extract}/> : <Description />}
              </div>
            )}
            {mobileTab === 'editor' && (
              <div className="w-full h-full">
                <Editor
                  height="100%"
                  width="100%"
                  defaultLanguage={language}
                  theme="vs-dark"
                  options={{ fontSize: 12, minimap: { enabled: false } }}
                  value={code}
                  onChange={(value)=>{setCode(value)}}
                />
              </div>
            )}
            {mobileTab === 'testcases' && (
              <TestCases injected={injectcode}/>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='h-screen flex flex-col'>
      {navBar && <Navbar />}
      <div className='bg-[#1A1A1A] h-[93vh] flex flex-col flex-1 overflow-y-hidden overflow-x-hidden min-h-0'>
        <Code_setting setSubmissions={setSubmissions} submissions={submissions} reset={onreset}/>
        <Split renderBar={({ onMouseDown, ...props }) => {
          return (
            <div {...props} style={{ boxShadow: 'none', background: 'transparent' }}>
              <div onMouseDown={onMouseDown} style={{ backgroundColor: '#0000004d', boxShadow: 'none' }} />
            </div>
          );
        }} >
          <div className="w-full p-5 rounded-xl overflow-y-scroll hide-scrollbar">
            {submissions ? <Submissions extract={extract}/> : <Description />}
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
                  defaultLanguage={language}
                  theme="vs-dark"
                  options={{ fontSize: 14, minimap: { enabled: false } }}
                  value={code}
                  onChange={(value)=>{setCode(value)}}
                />
              </div>
              <TestCases injected={injectcode}/>
            </Split>
          </div>
        </Split>
      </div>
    </div>
  )
}

export default Problem


