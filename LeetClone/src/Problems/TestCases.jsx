import React, { useContext, useState, useEffect } from 'react';
import { Mycontext } from '../conf/context';
import axios from 'axios'

const TestCases = () => {
  const { problem ,code,language,setOutput} = useContext(Mycontext);
  const [parsedInput, setParsedInput] = useState(null);
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0);

  const handlecode = async() =>{
    try{
      const result = await axios.post("http://localhost:4000/run",{code:code,language:language})
  
      if(result.data.output){
        setOutput(result.data.output);
        console.log(result.data.output);
      }else{
        setOutput(result.data.error);
      }
    }
    catch(err){
      setOutput("error contacting server");
    }

  }
  
  const parseInput = (exampleInput) => {
  const trimmed = exampleInput.trim();
  const lines = trimmed.split('\n');

    if (lines.length === 2) {
      try {
        const functions = JSON.parse(lines[0]);
        const args = JSON.parse(lines[1]);

        if (Array.isArray(functions) && Array.isArray(args)) {
          return {
            type: 'function_calls',
            steps: functions.map((fn, idx) => ({
              function: fn,
              args: args[idx],
            })),
          };
        }
      } catch (e) {
      }
    }

    const inputRegex = /([a-zA-Z_]\w*)\s*=\s*(\[[^\]]*\]|\S+)/g;
    const inputPairs = {};
    let match;
    while ((match = inputRegex.exec(exampleInput))) {
      inputPairs[match[1]] = match[2];
    }

    return {
      type: 'key_value',
      values: inputPairs,
    };
  };

  useEffect(() => {
    if (problem && problem.examples && problem.examples.length > 0) {
      const parsed = parseInput(problem.examples[0].input);
      setParsedInput(parsed);
    }
  }, [problem]);

  const handleExampleClick = (example, index) => {
    const parsed = parseInput(example.input);
    setParsedInput(parsed);
    setSelectedExampleIndex(index);
  };

  if (!problem) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="h-full p-4 bg-[#202020] text-white">
      <div className="grid grid-cols-6">
        <label className="text-white text-xl font-semibold">Test Cases</label>
        <label className="text-white ml-10 text-xl font-semibold col-span-3">Output</label>
        <button className="bg-[#2d2d2d] p-2 rounded-xl font-semibold cursor-pointer" onClick={handlecode}>Run</button>
        <button className="bg-green-600 p-2 rounded-xl font-semibold w-20 ml-2 cursor-pointer">Submit</button>
      </div>
      <hr className="mt-3" />

      <div className="h-full w-full mt-3">
        <div className="flex flex-row w-full mb-3">
          {problem.examples?.map((example, ind) => (
            <button
              key={ind}
              className={`bg-[#2d2d2d] p-2 rounded-xl mr-3 ${selectedExampleIndex === ind ? 'bg-blue-700' : ''}`}
              onClick={() => handleExampleClick(example, ind)}
            >
              Case {ind + 1}
            </button>
          ))}
        </div>

<div className="flex flex-wrap gap-4 bg-[#2d2d2d] border border-green-200 p-3">
  {parsedInput?.type === 'function_calls' ? (
    parsedInput.steps.map((step, idx) => (
      <div key={idx} className="inline-block">
        <span className="font-semibold">{step.function}</span>
        <span>({JSON.stringify(step.args)})</span>
      </div>
    ))
  ) : parsedInput?.type === 'key_value' ? (
    Object.entries(parsedInput.values).map(([key, value]) => (
      <div key={key} className="inline-block">
        <span className="font-semibold">{key}:</span> {value}
      </div>
    ))
  ) : (
    <div>No valid input detected.</div>
  )}
</div>

        

      </div>
    </div>
  );
};

export default TestCases;
