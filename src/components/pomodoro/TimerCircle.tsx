import React from 'react';

interface TimerCircleProps {
  remainingSeconds: number;
  duration: number;
  isRunning: boolean;
}

export const TimerCircle: React.FC<TimerCircleProps> = ({ remainingSeconds, duration, isRunning }) => {
  const progress = isRunning
    ? Math.max(0, Math.min(100, Math.round(((duration - remainingSeconds) / duration) * 100)))
    : 0;

  const formatTime = (total: number) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="128" cy="128" r="110"
          stroke="currentColor" strokeWidth="12"
          className="text-slate-800" fill="transparent"
        />
        <circle
          cx="128" cy="128" r="110"
          stroke="currentColor" strokeWidth="12"
          className="text-emerald-400 transition-all duration-1000"
          fill="transparent"
          strokeDasharray={2 * Math.PI * 110}
          strokeDashoffset={2 * Math.PI * 110 * (1 - progress / 100)}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-extrabold font-mono text-white tracking-tight">
          {formatTime(remainingSeconds)}
        </span>
        <span className="text-xs text-slate-400 mt-2 font-medium">
          {isRunning ? `${progress}% elapsed` : 'Select duration'}
        </span>
      </div>
    </div>
  );
};
