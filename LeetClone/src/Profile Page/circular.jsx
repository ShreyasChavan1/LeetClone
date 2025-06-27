import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function ProgressRing() {
  const solved = 40;
  const total = 3580;
  const percentage = (solved / total) * 100;

  return (
    <div className="w-30 h-30 bg-[#1e1e1e] rounded-full flex items-center justify-center">
      <CircularProgressbarWithChildren
        value={percentage}
        styles={buildStyles({
          pathColor: '#00E676',
          trailColor: '#333',
          strokeLinecap: 'round',
        })}
      >
        <div className="text-center text-white">
          <p className="text-x font-bold">{solved}/{total}</p>
          <p className="text-sm text-green-400">✓ Solved</p>
          <p className="text-xs text-gray-400 mt-1">0 Attempting</p>
        </div>
      </CircularProgressbarWithChildren>
    </div>
  );
}
