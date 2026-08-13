import React, { useEffect, useState } from 'react';

interface DurationPresetsProps {
  defaultMinutes: number;
  selected: number;
  onSelect: (seconds: number) => void;
}

export const DurationPresets: React.FC<DurationPresetsProps> = ({
  defaultMinutes,
  selected,
  onSelect
}) => {
  const defaultSeconds = defaultMinutes * 60;
  const [customMinutes, setCustomMinutes] = useState<string>(
    selected === defaultSeconds ? '' : String(selected / 60)
  );

  useEffect(() => {
    setCustomMinutes(selected === defaultSeconds ? '' : String(selected / 60));
  }, [defaultSeconds, selected]);

  const handleCustomChange = (value: string) => {
    setCustomMinutes(value);
    const minutes = Number(value);
    if (Number.isFinite(minutes) && minutes >= 1 && minutes <= 180) {
      onSelect(Math.round(minutes * 60));
    }
  };

  const customSelected = selected !== defaultSeconds;

  return (
    <div className="grid grid-cols-2 gap-3 text-left">
      <button
        type="button"
        onClick={() => onSelect(defaultSeconds)}
        className={`py-3 rounded-xl border text-sm font-bold transition-all ${
          !customSelected
            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
        }`}
      >
        {defaultMinutes} minutes
      </button>

      <label className={`rounded-xl border px-3 py-2 transition-all ${
        customSelected
          ? 'bg-emerald-500/20 border-emerald-500'
          : 'bg-slate-900 border-slate-800 focus-within:border-slate-600'
      }`}>
        <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">Custom minutes</span>
        <input
          type="number"
          min="1"
          max="180"
          step="1"
          value={customMinutes}
          onChange={(event) => handleCustomChange(event.target.value)}
          placeholder="Enter time"
          className="w-full bg-transparent text-sm font-bold text-slate-200 placeholder-slate-600 outline-none"
        />
      </label>
    </div>
  );
};
