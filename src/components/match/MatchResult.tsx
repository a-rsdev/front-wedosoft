import React from 'react';
import { ArrowRight, RotateCcw, Scale, Sparkles, Trophy } from 'lucide-react';
import { MatchFinishResponse } from '../../types';

interface MatchResultProps {
  result: MatchFinishResponse;
  totalRounds: number;
  onPlayAgain: () => void;
}

export const MatchResult: React.FC<MatchResultProps> = ({ result, totalRounds, onPlayAgain }) => {
  const own = {
    score: result.your_score,
    base: result.your_base_points,
    streak: result.your_streak_multiplier,
    win: result.your_win_multiplier,
    earned: result.your_points_earned
  };
  const opponentScore = result.opponent_score;
  const outcome = result.is_draw ? 'draw' : result.you_won ? 'victory' : 'defeat';
  const title = outcome === 'victory' ? 'Victory!' : outcome === 'defeat' ? 'Match complete' : 'Draw!';

  return (
    <div className="glass-panel mx-auto max-w-2xl space-y-6 rounded-3xl border border-slate-800 p-6 text-center sm:p-8">
      <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border ${outcome === 'victory' ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400' : outcome === 'draw' ? 'border-amber-500/40 bg-amber-500/15 text-amber-300' : 'border-purple-500/40 bg-purple-500/15 text-purple-300'}`}>
        {outcome === 'draw' ? <Scale className="h-10 w-10" /> : <Trophy className="h-10 w-10" />}
      </div>
      <div><h2 className="text-3xl font-black text-white">{title}</h2><p className="mt-1 text-sm text-slate-400">Final score from {totalRounds} rounds</p></div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
        <div><p className="text-xs text-slate-500">You</p><p className="text-4xl font-black text-cyan-300">{own.score}</p></div>
        <span className="text-xs font-black text-slate-600">VS</span>
        <div><p className="text-xs text-slate-500">Opponent</p><p className="text-4xl font-black text-purple-300">{opponentScore}</p></div>
      </div>
      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5 text-left">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-cyan-300"><Sparkles className="h-4 w-4" /> Your points breakdown</div>
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-bold">
          <span className="rounded-lg bg-slate-900 px-3 py-2 text-white">{own.base} base</span><ArrowRight className="h-4 w-4 text-slate-600" />
          <span className="rounded-lg bg-slate-900 px-3 py-2 text-purple-300">× {own.streak} streak</span><ArrowRight className="h-4 w-4 text-slate-600" />
          <span className="rounded-lg bg-slate-900 px-3 py-2 text-emerald-300">× {own.win} win</span><ArrowRight className="h-4 w-4 text-slate-600" />
          <span className="rounded-lg bg-cyan-500/15 px-3 py-2 text-cyan-300">+{own.earned} PTS</span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-cyan-500/10 pt-4 text-sm">
          <span className="text-slate-400">Total points on this roadmap</span>
          <span className="font-black text-cyan-300">{result.your_roadmap_points_total} PTS</span>
        </div>
      </div>
      <button onClick={onPlayAgain} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#c7f43a] py-3.5 text-sm font-extrabold text-[#1c2a1d] shadow-lg shadow-lime-500/20 transition-transform hover:scale-[1.01]">
        <RotateCcw className="h-4 w-4" /> Play again
      </button>
    </div>
  );
};
