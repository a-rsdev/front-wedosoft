import React from 'react';
import { Unit } from '../../types';
import { CheckCircle2, ChevronRight, Lock } from 'lucide-react';

interface UnitListProps {
  units: Unit[];
  selectedId: string | undefined;
  onSelect: (unit: Unit) => void;
}

export const UnitList: React.FC<UnitListProps> = ({ units, selectedId, onSelect }) => {
  return (
    <div className="space-y-2">
      {units.map((u) => {
        const isSelected = selectedId === u.id;
        return (
          <div
            key={u.id}
            onClick={() => !u.locked && onSelect(u)}
            className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
              u.locked
                ? 'opacity-50 cursor-not-allowed border-slate-800/60'
                : 'cursor-pointer'
            } ${
              isSelected
                ? 'bg-slate-800 border-cyan-500/40 shadow-sm'
                : 'glass-panel border-slate-800/80 hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-cyan-400">
                {u.order}
              </span>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">{u.title}</h4>
                <span className="text-[11px] text-slate-500 font-mono">ID: {u.id}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {u.locked ? (
                <span className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                  <Lock className="w-3.5 h-3.5" />
                  Locked
                </span>
              ) : u.completed ? (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Done
                </span>
              ) : (
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  Pending
                </span>
              )}
              {!u.locked && <ChevronRight className="w-4 h-4 text-slate-500" />}
            </div>
          </div>
        );
      })}
    </div>
  );
};