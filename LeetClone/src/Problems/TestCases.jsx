import React, { useContext, useState, useEffect } from 'react';
import { Mycontext } from '../conf/context';
import { auth } from '../conf/config';


const TestCases = ({ injected }) => {
  const { problem, code, language, status, verdict, socketRef, suburl, output, setStatus } = useContext(Mycontext);
  const [parsedInput, setParsedInput] = useState(null);
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const final = injected(problem?.templates?.[language], code);
  const difficult = problem.difficulty
  useEffect(() => {
    setSubmitted(false)
  }, [])

  const handlecode = async () => {
    const title = problem.title;
    const token = await auth.currentUser.getIdToken();
    const res = await fetch("http://localhost:4000/submit", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        code: final,
        language: language,
        prob: title,
        difficulty: difficult
      })
    })
    const data = await res.json();
    suburl.current = data.submissionID
    if (socketRef.current && suburl.current) {
      console.log("changed submissionid ", suburl.current)
      socketRef.current.emit('joinSubmission', suburl.current);
    }
    setSubmitted(true)
  };

  const parseInput = (exampleInput) => {
    const trimmed = exampleInput.trim();

    // Helper: safely try JSON.parse
    const safeParse = (str) => {
      try {
        return JSON.parse(str);
      } catch {
        return null;
      }
    };

    // ✅ 1. Function calls: two lines (["Twitter",...], [[],...])
    const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 2) {
      const functions = safeParse(lines[0]);
      const args = safeParse(lines[1]);
      if (Array.isArray(functions) && Array.isArray(args)) {
        return {
          type: 'function_calls',
          steps: functions.map((fn, i) => ({
            function: fn,
            args: args[i],
          })),
        };
      }
    }

    // ✅ 2. Handle arrays or objects (like [[1,3],[2,6]] or {a:1})
    const arrayLike = trimmed
      .replace(/\n/g, '') // remove newlines
      .replace(/\s+/g, ''); // clean spaces
    const parsedArray = safeParse(arrayLike);
    if (Array.isArray(parsedArray)) {
      return { type: 'array', values: parsedArray };
    }

    // ✅ 3. Key-value style: nums=[2,7,11,15], target=9
    const inputPairs = {};
    const keyValueRegex = /([a-zA-Z_]\w*)\s*=\s*(\[[^\]]*\]|\{[^\}]*\}|\S+)/g;
    let match;
    while ((match = keyValueRegex.exec(trimmed))) {
      const key = match[1];
      const valueStr = match[2];
      const parsedValue = safeParse(valueStr);
      inputPairs[key] = parsedValue ?? valueStr;
    }
    if (Object.keys(inputPairs).length > 0) {
      return { type: 'key_value', values: inputPairs };
    }

    // ✅ 4. Fallback to raw string
    return { type: 'raw', raw: trimmed };
  };


  useEffect(() => {
    if (problem && problem.examples && problem.examples.length > 0) {
      const parsed = parseInput(problem.examples[0].input);
      setParsedInput(parsed);
      setStatus("")
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
        <label className={`${status === "" ? "text-white" : "text-gray-400"} text-xl font-semibold`}>Test Cases</label>
        <label className={`${status !== "" ? "text-white" : "text-gray-400"} ml-10 text-xl font-semibold col-span-3`}>Output</label>
        {/* <button className="bg-[#2d2d2d] p-2 rounded-xl font-semibold cursor-pointer" >Run</button> */}
        <button className="bg-green-600 p-2 rounded-xl font-semibold w-20 ml-2 cursor-pointer" onClick={handlecode}>Submit</button>
      </div>

      {!submitted || status === "" ? (<>
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
          <div className="flex flex-wrap gap-4 bg-[#2d2d2d] border border-green-200 p-3 rounded-md break-words">
            {parsedInput?.type === 'function_calls' ? (
              parsedInput.steps.map((step, idx) => (
                <div key={idx} className="bg-[#1f1f1f] px-3 py-2 rounded-md">
                  <span className="font-semibold text-green-300">{step.function}</span>
                  <span className="text-gray-300">({JSON.stringify(step.args)})</span>
                </div>
              ))
            ) : parsedInput?.type === 'key_value' ? (
              Object.entries(parsedInput.values).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-[#1f1f1f] px-3 py-2 rounded-md text-gray-300"
                >
                  <span className="font-semibold text-green-300">{key}:</span>{' '}
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </div>
              ))
            ) : parsedInput?.type === 'array' ? (
              <div className="bg-[#1f1f1f] p-3 rounded-md w-full break-words text-gray-300">
                {JSON.stringify(parsedInput.values)}
              </div>
            ) : parsedInput?.type === 'raw' ? (
              <div className="bg-[#1f1f1f] px-3 py-2 rounded-md text-gray-300">
                {parsedInput.raw}
              </div>
            ) : (
              <div className="text-gray-400">No valid input detected.</div>
            )}
          </div>

        </div>
      </>) : status !== "Completed" ? (
        <>
          <p className='text-yellow-300'>{status}...</p>
        </>
      ) : (
        <>
          <div className={`${verdict === "Accepted" ? "text-green-400" : "text-red-500"}`}>
            {verdict === "Accepted" ? (
              "Accepted"
            ) : (
              <>
                {verdict}
                <br />
                {output}
              </>
            )}
          </div>
        </>
      )}

    </div>
  );
};

export default TestCases;
