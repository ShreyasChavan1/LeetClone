import { useContext } from 'react';
import { useEffect } from 'react';
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Mycontext } from '../conf/context';

export default function ProgressRing() {
  const {problems,solvedQuestions,setSolvedQuestions,currentuser} = useContext(Mycontext)
  const total = problems.length;
  const solved = solvedQuestions.length;
  const percentage = (solved / total) * 100;
  return (
    <div className="w-20 sm:w-24 md:w-30 h-20 sm:h-24 md:h-30 bg-[#1e1e1e] rounded-full flex items-center justify-center">
      <CircularProgressbarWithChildren
        value={percentage}
        styles={buildStyles({
          pathColor: '#00E676',
          trailColor: '#333',
          strokeLinecap: 'round',
        })}
      >
        <div className="text-center text-white">
          <p className="text-lg sm:text-xl font-bold">{solved}/{total}</p>
          <p className="text-xs sm:text-sm text-green-400">✓ Solved</p>
        </div>
      </CircularProgressbarWithChildren>
    </div>
  );
}
