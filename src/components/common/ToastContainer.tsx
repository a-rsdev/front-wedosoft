import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl border shadow-xl flex items-start gap-3 transition-all duration-300 animate-slide-up ${
            toast.type === 'error'
              ? 'bg-slate-900/95 border-rose-500/40 text-rose-200'
              : toast.type === 'success'
              ? 'bg-slate-900/95 border-emerald-500/40 text-emerald-200'
              : 'bg-slate-900/95 border-cyan-500/40 text-cyan-200'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-cyan-400" />}
          </div>

          <div className="flex-1">
            <h4 className="text-sm font-bold text-white">{toast.title}</h4>
            {toast.message && (
              <p className="text-xs mt-0.5 opacity-80 font-mono">{toast.message}</p>
            )}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
