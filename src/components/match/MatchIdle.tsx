import React from 'react';
import { Swords, ShieldAlert } from 'lucide-react';

interface MatchIdleProps {
  gateError: any;
  loading: boolean;
  onFind: () => void;
}

export const MatchIdle: React.FC<MatchIdleProps> = ({ gateError, loading, onFind }) => {
  return (
    <div className="glass-panel rounded-3xl p-8 border border-slate-800 text-center max-w-2xl mx-auto space-y-6">
      <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-purple-500/20">
        <Swords className="w-10 h-10 text-white" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white">Ready to Duel?</h2>
        <p className="text-sm text-slate-400 mt-2">
          The system will match you with an opponent (topics_completed ≥ 5). Questions are drawn from the weakest player's latest units.
        </p>
      </div>

      {gateError && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <ShieldAlert className="w-5 h-5" />
            <span>403 Forbidden — {gateError.error}</span>
          </div>
          <p className="text-xs text-amber-200">
            {gateError.message || 'You need to complete at least 5 units before entering PvP matchmaking.'}
          </p>
        </div>
      )}

      <button
        onClick={onFind}
        disabled={loading}
        className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold shadow-xl shadow-purple-500/25 transition-all hover:scale-105 disabled:opacity-50"
      >
        Find Opponent
      </button>
    </div>
  );
};
