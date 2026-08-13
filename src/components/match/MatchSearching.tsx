import React from 'react';
import { Radio, Swords } from 'lucide-react';

export const MatchSearching: React.FC<{ roadmapTitle: string }> = ({ roadmapTitle }) => (
  <div className="glass-panel mx-auto max-w-xl space-y-6 rounded-3xl border border-slate-800 p-12 text-center">
    <div className="relative mx-auto h-24 w-24">
      <div className="absolute inset-0 animate-spin rounded-full border-4 border-purple-500/20 border-t-purple-400" />
      <div className="flex h-full w-full items-center justify-center text-purple-400">
        <Swords className="h-8 w-8 animate-pulse" />
      </div>
    </div>
    <div>
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
        <Radio className="h-3.5 w-3.5" /> {roadmapTitle}
      </div>
      <h3 className="text-xl font-bold text-white">Searching for an opponent...</h3>
      <p className="mt-2 text-sm text-slate-400">You are in the queue. Matchmaking refreshes automatically.</p>
    </div>
  </div>
);
