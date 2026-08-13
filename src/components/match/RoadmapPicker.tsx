import React from 'react';
import { BookOpen, CheckCircle2, Loader2, LockKeyhole, RefreshCw, Sparkles } from 'lucide-react';
import { MatchRoadmap } from '../../types';

interface RoadmapPickerProps {
  roadmaps: MatchRoadmap[];
  loading: boolean;
  error: string | null;
  onSelect: (roadmap: MatchRoadmap) => void;
  onRetry: () => void;
}

export const RoadmapPicker: React.FC<RoadmapPickerProps> = ({ roadmaps, loading, error, onSelect, onRetry }) => (
  <div className="space-y-6">
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-white">Choose your battle roadmap</h2>
      <p className="mt-1 text-sm text-slate-400">You need at least five completed units in a roadmap to enter its matchmaking pool.</p>
    </div>

    {loading && (
      <div className="glass-panel flex min-h-56 items-center justify-center rounded-3xl border border-slate-800">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    )}

    {!loading && error && (
      <div className="glass-panel rounded-3xl border border-rose-500/30 p-8 text-center">
        <p className="text-sm font-semibold text-rose-300">{error}</p>
        <button onClick={onRetry} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-3 text-sm font-bold text-white hover:bg-slate-700">
          <RefreshCw className="h-4 w-4" /> Try again
        </button>
      </div>
    )}

    {!loading && !error && roadmaps.length === 0 && (
      <div className="glass-panel rounded-3xl border border-slate-800 p-10 text-center text-sm text-slate-400">Complete at least one unit in a roadmap to see it here.</div>
    )}

    {!loading && !error && roadmaps.length > 0 && (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roadmaps.map((roadmap) => {
          const progress = Math.min(100, (roadmap.completed_units / 5) * 100);
          return (
            <button
              key={roadmap.id}
              type="button"
              disabled={!roadmap.eligible}
              onClick={() => onSelect(roadmap)}
              className={`group rounded-2xl border p-5 text-left transition-all ${roadmap.eligible
                ? 'glass-card border-cyan-500/20 hover:-translate-y-1 hover:border-cyan-400/60'
                : 'cursor-not-allowed border-slate-800 bg-slate-900/40 opacity-65'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${roadmap.eligible ? 'bg-cyan-500/15 text-cyan-300' : 'bg-slate-800 text-slate-500'}`}>
                  <BookOpen className="h-5 w-5" />
                </div>
                {roadmap.eligible ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <LockKeyhole className="h-5 w-5 text-slate-500" />}
              </div>
              <div className="mt-5 flex items-start justify-between gap-3">
                <h3 className="font-bold text-white">{roadmap.title}</h3>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-purple-500/10 px-2 py-1 text-[11px] font-bold text-purple-300">
                  <Sparkles className="h-3 w-3" /> {roadmap.points} PTS
                </span>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div className={`h-full rounded-full ${roadmap.eligible ? 'bg-emerald-400' : 'bg-slate-600'}`} style={{ width: `${progress}%` }} />
              </div>
              <p className={`mt-2 text-xs ${roadmap.eligible ? 'text-emerald-400' : 'text-slate-500'}`}>
                {roadmap.eligible ? `${roadmap.completed_units} units completed · Ready to battle` : `${roadmap.completed_units}/5 units completed`}
              </p>
            </button>
          );
        })}
      </div>
    )}
  </div>
);
