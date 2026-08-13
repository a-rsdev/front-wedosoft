import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { AppRoutes } from '../constants/routes';
import { Zap, Lock, User, ArrowRight } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [nickname, setNickname] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { login, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !password.trim()) {
      showToast('error', 'Validation error', 'FIELDS_REQUIRED');
      return;
    }
    setLoading(true);
    const res = isLogin ? await login(nickname, password) : await register(nickname, password);
    setLoading(false);
    if (res.success) {
      showToast('success', isLogin ? 'Signed in successfully' : 'Account created');
      navigate(AppRoutes.HOME);
    } else {
      showToast('error', isLogin ? 'Login failed' : 'Registration failed', res.error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#c7f43a] mb-4 shadow-xl shadow-lime-500/20">
            <Zap className="w-8 h-8 text-[#1c2a1d]" />
          </div>
          <div className="mb-2 text-lg font-extrabold tracking-[-0.04em] text-[#172018]">EduComp</div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#172018]">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Gamified learning platform with 1v1 knowledge duels
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-8 shadow-2xl border border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Nickname</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="alex_coder"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl py-3 pl-11 pr-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl py-3 pl-11 pr-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#c7f43a] hover:bg-[#b9e72d] text-[#1c2a1d] font-extrabold shadow-lg shadow-lime-500/25 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center pt-4 border-t border-slate-800">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
            >
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
