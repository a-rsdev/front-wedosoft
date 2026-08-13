import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Flame, GraduationCap, Home, LogOut, Swords, Timer } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AppRoutes } from '../constants/routes';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const navLinks = [
    { path: AppRoutes.HOME, label: 'Home', icon: Home },
    { path: AppRoutes.ROADMAPS, label: 'Roadmaps', icon: BookOpen },
    { path: AppRoutes.PVP, label: '1v1 Arena', icon: Swords },
    { path: AppRoutes.POMODORO, label: 'Pomodoro', icon: Timer }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#e3ebe5] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto grid h-[72px] max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to={AppRoutes.HOME} className="group flex items-center gap-2.5" aria-label="EduComp home">
          <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#c7f43a] text-[#1c2a1d] shadow-[0_8px_22px_-12px_rgba(98,140,0,.8)] transition-transform group-hover:-rotate-3 group-hover:scale-105">
            <GraduationCap className="h-6 w-6" strokeWidth={2.2} />
          </span>
          <span className="hidden text-lg font-extrabold tracking-[-0.04em] text-[#172018] sm:block">EduComp</span>
        </Link>

        <nav className="mx-auto hidden items-center gap-1 rounded-2xl border border-[#e3ebe5] bg-[#f7faf8] p-1.5 md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path} className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${isActive ? 'bg-white text-[#1f2a21] shadow-[0_4px_15px_-10px_rgba(20,40,25,.7)] ring-1 ring-[#dfe8e1]' : 'text-[#6a776e] hover:bg-white/70 hover:text-[#263429]'}`}>
                <Icon className={`h-4 w-4 ${isActive ? 'text-[#78a800]' : ''}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-2">
          {user ? (
            <>
              <div title="Activity streak" className="flex items-center gap-1.5 rounded-xl border border-[#f3dfcf] bg-[#fff8f2] px-3 py-2 text-[#b95f1d]">
                <Flame className="h-4 w-4" />
                <span className="text-sm font-extrabold">{user.streak_count ?? 0}d</span>
              </div>
              <button onClick={() => { logout(); navigate(AppRoutes.AUTH); }} title="Sign out" className="rounded-xl p-2.5 text-[#7b8980] transition-colors hover:bg-[#fff0f3] hover:text-[#df315f]">
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <Link to={AppRoutes.AUTH} className="rounded-xl bg-[#c7f43a] px-4 py-2.5 text-sm font-extrabold text-[#1c2a1d] transition-transform hover:scale-[1.03]">Sign in</Link>
          )}
        </div>
      </div>

      <nav className="grid grid-cols-4 border-t border-[#edf2ee] bg-white px-2 py-1.5 md:hidden">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return <Link key={link.path} to={link.path} className={`flex flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-bold ${isActive ? 'bg-[#f1f9d8] text-[#527500]' : 'text-[#758178]'}`}><Icon className="h-4 w-4" />{link.label}</Link>;
        })}
      </nav>
    </header>
  );
};
