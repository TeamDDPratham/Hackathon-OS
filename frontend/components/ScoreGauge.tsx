import React from 'react';

interface ScoreGaugeProps {
  score: number;
  grade: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, grade }) => {
  const getColor = (s: number) => {
    if (s >= 90) return { ring: 'text-emerald-500', bg: 'from-emerald-500/20 to-transparent', label: 'EXCELLENT', text: 'text-emerald-400' };
    if (s >= 75) return { ring: 'text-blue-500', bg: 'from-blue-500/20 to-transparent', label: 'GOOD', text: 'text-blue-400' };
    if (s >= 60) return { ring: 'text-amber-500', bg: 'from-amber-500/20 to-transparent', label: 'NEEDS WORK', text: 'text-amber-400' };
    if (s >= 40) return { ring: 'text-orange-500', bg: 'from-orange-500/20 to-transparent', label: 'POOR', text: 'text-orange-400' };
    return { ring: 'text-red-500', bg: 'from-red-500/20 to-transparent', label: 'CRITICAL RISKS', text: 'text-red-400' };
  };

  const config = getColor(score);
  const strokeDashoffset = 283 - (283 * score) / 100;

  return (
    <div className={`relative flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b ${config.bg} border border-slate-800 backdrop-blur-md shadow-2xl`}>
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            className="text-slate-800/80 stroke-current"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            className={`${config.ring} stroke-current transition-all duration-1000 ease-out`}
            strokeWidth="8"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold tracking-tighter text-white font-mono">{score}</span>
          <span className="text-xs uppercase font-mono text-slate-400 tracking-widest mt-0.5">GRADE {grade}</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <span className={`text-xs font-mono font-bold tracking-widest px-3 py-1 rounded-full border border-slate-700 bg-slate-900/80 ${config.text}`}>
          {config.label}
        </span>
      </div>
    </div>
  );
};
