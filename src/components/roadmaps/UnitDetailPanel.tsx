import React from 'react';
import { UnitDetail } from '../../types';
import { BookOpen, ExternalLink, CheckCircle2, Sparkles, HelpCircle, PlayCircle } from 'lucide-react';

interface UnitDetailPanelProps {
  unitDetail: UnitDetail | null;
  onStartTest: () => void;
}

export const UnitDetailPanel: React.FC<UnitDetailPanelProps> = ({ unitDetail, onStartTest }) => {
  if (!unitDetail) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
        <HelpCircle className="w-12 h-12 mb-3 text-slate-600" />
        <p className="text-sm font-medium">Select a unit from the list to view materials and take the test</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center justify-end">
          {unitDetail.completed && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              Completed
            </span>
          )}
        </div>
        <h2 className="text-2xl font-extrabold text-white mt-1">{unitDetail.title}</h2>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">
          Learning Materials ({unitDetail.resources?.length || 0})
        </h3>
        {unitDetail.resources && unitDetail.resources.length > 0 ? (
          <div className="space-y-2">
            {unitDetail.resources.map((res) => (
              <a
                key={res.id}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-sm text-slate-200 hover:text-cyan-400 transition-all group"
              >
                <span className="font-medium flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                  {res.title}
                </span>
                <ExternalLink className="w-4 h-4 text-slate-500" />
              </a>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">No materials assigned yet.</p>
        )}
      </div>

      {unitDetail.test_available && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#fbfff2] to-[#f1fae5] border border-[#dce8d3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Unit Final Test
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Questions: {unitDetail.questions?.length || 0} &bull; Passing score: ≥ 75%
            </p>
          </div>
          <button
            onClick={onStartTest}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#c7f43a] hover:bg-[#b8e52c] text-[#1c2a1d] font-bold shadow-lg shadow-lime-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.03]"
          >
            <PlayCircle className="w-5 h-5" />
            <span>Start Test</span>
          </button>
        </div>
      )}
    </div>
  );
};
