import React, { useEffect, useMemo, useState } from 'react';
import { Check, Clock3, Loader2, ShieldCheck, Swords, X } from 'lucide-react';
import { Match, MatchQuestion, MatchRoundResult } from '../../types';

export interface RoundRevealData {
  question: MatchQuestion | null;
  round: MatchRoundResult;
  roundNumber: number;
}

interface BattleArenaProps {
  match: Match;
  selectedOption: number | null;
  submitting: boolean;
  reveal: RoundRevealData | null;
  onAnswer: (questionId: string, optionIndex: number) => void;
}

export const BattleArena: React.FC<BattleArenaProps> = ({ match, selectedOption, submitting, reveal, onAnswer }) => {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    const update = () => setSecondsLeft(match.answer_deadline ? Math.max(0, Math.ceil((new Date(match.answer_deadline).getTime() - Date.now()) / 1000)) : 0);
    update();
    const timer = window.setInterval(update, 250);
    return () => window.clearInterval(timer);
  }, [match.answer_deadline]);

  const myScore = match.rounds.filter((round) => round.your_correct).length;
  const opponentScore = match.rounds.filter((round) => round.opponent_correct).length;
  const question = reveal?.question ?? match.current_question;
  const progressRound = reveal ? reveal.roundNumber : Math.min(match.current_round + 1, match.total_rounds);
  const progress = match.total_rounds ? Math.min(100, (progressRound / match.total_rounds) * 100) : 0;
  const myRevealCorrect = reveal?.round.your_correct ?? false;
  const opponentRevealCorrect = reveal?.round.opponent_correct ?? false;
  const mySelectedIndex = reveal?.round.your_selected_index ?? -1;
  const options = useMemo(() => question?.options ?? [], [question]);
  const locked = submitting || selectedOption !== null || match.you_answered_current || secondsLeft === 0;

  return (
    <div className="space-y-5">
      <div className="glass-panel rounded-2xl border border-slate-800 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-500/15 font-bold text-cyan-300">YOU</div>
            <div><p className="text-xs text-slate-500">Your score</p><p className="text-xl font-black text-cyan-300">{myScore}</p></div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-2 text-xs font-black text-slate-400"><Swords className="h-4 w-4" /> VS</div>
          <div className="flex items-center gap-3 text-right">
            <div><p className="text-xs text-slate-500">Opponent</p><p className="text-xl font-black text-purple-300">{opponentScore}</p></div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-500/40 bg-purple-500/15 font-bold text-purple-300">P2</div>
          </div>
        </div>
      </div>

      <div className="glass-panel overflow-hidden rounded-3xl border border-slate-800">
        <div className="h-1.5 bg-slate-800"><div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all" style={{ width: `${progress}%` }} /></div>
        <div className="space-y-6 p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4 text-xs font-semibold text-slate-400">
            <span>Round {progressRound} of {match.total_rounds}</span>
            {!reveal && (
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono ${secondsLeft <= 5 ? 'bg-rose-500/15 text-rose-300' : 'bg-cyan-500/10 text-cyan-300'}`}>
                <Clock3 className="h-4 w-4" /> 0:{String(secondsLeft).padStart(2, '0')}
              </span>
            )}
          </div>

          {reveal && (
            <div className={`rounded-2xl border p-4 text-center ${myRevealCorrect ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-rose-500/30 bg-rose-500/10'}`}>
              <div className="flex items-center justify-center gap-2 text-lg font-black text-white">
                {myRevealCorrect ? <Check className="h-6 w-6 text-emerald-400" /> : <X className="h-6 w-6 text-rose-400" />}
                {myRevealCorrect ? 'Correct!' : 'Not quite'}
              </div>
              <p className="mt-1 text-xs text-slate-400">Your opponent answered {opponentRevealCorrect ? 'correctly' : 'incorrectly'}.</p>
            </div>
          )}

          <h3 className="text-lg font-bold leading-relaxed text-white sm:text-xl">{question?.text ?? 'Preparing the result...'}</h3>

          {options.length > 0 && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {options.map((option, index) => {
                const isCorrect = reveal?.round.correct_option_index === index;
                const isWrongSelection = Boolean(reveal) && mySelectedIndex === index && !isCorrect;
                const isSelected = !reveal && selectedOption === index;
                const style = isCorrect
                  ? 'border-[#91c91e] bg-[#cfff62] text-[#21310f] shadow-[0_10px_25px_-18px_rgba(80,120,0,.8)]'
                  : isWrongSelection
                    ? 'border-[#ff3f72] bg-[#ff5f89] text-[#fff] shadow-[0_10px_25px_-18px_rgba(220,30,80,.8)]'
                    : isSelected
                      ? 'border-[#9bc836] bg-[#f0fad6] text-[#3d5811]'
                      : reveal
                        ? 'border-[#f1d3d9] bg-[#fff1f3] text-[#805d63]'
                        : 'border-[#dce5de] bg-white text-[#3a473e] hover:border-[#b7d85f]';
                return (
                  <button key={index} type="button" disabled={Boolean(reveal) || locked} onClick={() => question && onAnswer(question.id, index)} className={`flex min-h-16 items-center gap-3 rounded-2xl border p-4 text-left text-sm font-medium transition-all disabled:cursor-default ${style}`}>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/65 font-mono text-xs font-bold">{String.fromCharCode(65 + index)}</span>
                    <span className="flex-1">{option}</span>
                    {isCorrect && <Check className="h-5 w-5 text-emerald-400" />}
                    {isWrongSelection && <X className="h-5 w-5 text-rose-400" />}
                  </button>
                );
              })}
            </div>
          )}

          {!reveal && locked && (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-400">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin text-cyan-400" /> : <ShieldCheck className="h-4 w-4 text-purple-400" />}
              {secondsLeft === 0 && !match.you_answered_current ? 'Time is up — waiting for the server...' : match.opponent_answered_current ? 'Answer locked — revealing shortly...' : 'Answer locked — waiting for your opponent...'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
