import React from 'react';
import { Roadmap } from '../../types';
import { BookOpen } from 'lucide-react';

interface RoadmapTabsProps {
  roadmaps: Roadmap[];
  selectedId: string | undefined;
  onSelect: (roadmap: Roadmap) => void;
}

export const RoadmapTabs: React.FC<RoadmapTabsProps> = ({ roadmaps, selectedId, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {roadmaps.map((rm) => {
        const isSelected = selectedId === rm.id;
        return (
          <button
            key={rm.id}
            onClick={() => onSelect(rm)}
            className={`p-5 rounded-2xl text-left transition-all relative overflow-hidden border ${
              isSelected
                ? 'bg-gradient-to-br from-white to-[#f5fddf] border-[#b9dc5b] shadow-lg shadow-lime-500/10 ring-1 ring-[#cbe77f]'
                : 'glass-panel border-[#e1e9e3] hover:border-[#c5d6c8] hover:bg-white'
            }`}
          >
            <div className={`p-3 rounded-xl w-fit mb-3 ${isSelected ? 'bg-[#dcf791] text-[#5d8200]' : 'bg-[#eef3ef] text-[#718077]'}`}>
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-[#172018]">{rm.title}</h3>
          </button>
        );
      })}
    </div>
  );
};
