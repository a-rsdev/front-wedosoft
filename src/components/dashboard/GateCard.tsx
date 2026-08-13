import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock, Swords, Unlock } from 'lucide-react';
import { AppRoutes } from '../../constants/routes';

export const GateCard: React.FC<{ completedUnits: number }> = ({ completedUnits }) => {
  const isUnlocked = completedUnits >= 5;
  const progress = Math.min(100, Math.round((completedUnits / 5) * 100));

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#dce7de] bg-gradient-to-br from-white to-[#fbfff0] p-6 shadow-[0_18px_45px_-36px_rgba(38,61,33,.5)] sm:p-7">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex items-start gap-4">
          <div className={`rounded-2xl border p-4 ${isUnlocked ? 'border-[#bce48f] bg-[#e2ffc5] text-[#3d7c2e]' : 'border-[#f0d99e] bg-[#fff5dd] text-[#a76b16]'}`}>
            {isUnlocked ? <Unlock className="h-8 w-8" /> : <Lock className="h-8 w-8" />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-extrabold text-[#172018]">Matchmaking gate</h3>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${isUnlocked ? 'bg-[#e8fbd4] text-[#39732d]' : 'bg-[#fff3d9] text-[#9c661d]'}`}>{isUnlocked ? 'Unlocked' : 'Locked'}</span>
            </div>
            <p className="mt-1 max-w-xl text-sm leading-6 text-[#66736a]">
              {isUnlocked ? 'You have completed 5 units in one module and are ready to challenge an opponent.' : `Complete at least 5 units in one module to enter the arena. Your best module is at ${completedUnits}/5.`}
            </p>
            <div className="mt-4 h-2.5 w-full max-w-md overflow-hidden rounded-full bg-[#e9efe9]">
              <div className={`h-full transition-all duration-500 ${isUnlocked ? 'bg-[#99d629]' : 'bg-gradient-to-r from-[#ffc76b] to-[#b8ed45]'}`} style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
        <Link to={AppRoutes.PVP} aria-disabled={!isUnlocked} onClick={(event) => { if (!isUnlocked) event.preventDefault(); }} className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-extrabold transition-all ${isUnlocked ? 'bg-[#c7f43a] text-[#1c2a1d] shadow-[0_12px_25px_-16px_rgba(90,130,0,.8)] hover:scale-[1.03]' : 'cursor-not-allowed bg-[#edf2ee] text-[#88948c]'}`}>
          <Swords className="h-4 w-4" /> Enter arena <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};
