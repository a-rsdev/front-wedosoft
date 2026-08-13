import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMatchmakingGateApi } from '../api/matchesApi';
import { AppRoutes } from '../constants/routes';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { StatCard } from '../components/dashboard/StatCard';
import { GateCard } from '../components/dashboard/GateCard';
import { ModuleCard } from '../components/dashboard/ModuleCard';
import { Flame, BookOpen, Timer } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [matchmakingProgress, setMatchmakingProgress] = useState(0);

  useEffect(() => {
    let active = true;

    void getMatchmakingGateApi()
      .then((gate) => {
        if (active) setMatchmakingProgress(gate.completed_units);
      })
      .catch(() => {
        if (active) setMatchmakingProgress(0);
      });

    return () => {
      active = false;
    };
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <WelcomeBanner nickname={user.nickname} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <StatCard
          title="Activity Streak"
          value={user.streak_count ?? 0}
          suffix="Days"
          subtitle={`Points multiplier: x${Math.min(1 + (user.streak_count ?? 0) * 0.05, 2.0).toFixed(2)}`}
          icon={<Flame className="w-6 h-6" />}
          accentColor="lime"
        />
        <div className="flex items-center rounded-2xl border border-[#e2eae4] bg-white p-6 text-sm leading-6 text-[#637168] shadow-[0_16px_40px_-34px_rgba(20,40,25,.45)]">
          Keep your learning rhythm going. Every focused session and completed unit brings you closer to your next challenge.
        </div>
      </div>

      <GateCard completedUnits={matchmakingProgress} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ModuleCard
          to={AppRoutes.ROADMAPS}
          title="Roadmaps & Units"
          description="Study materials, take unit tests and level up your knowledge."
          icon={<BookOpen className="w-6 h-6" />}
          gradient="bg-[#d7fb75]"
          hoverColor="text-[#527500]"
        />
        <ModuleCard
          to={AppRoutes.POMODORO}
          title="Focus Timer (Pomodoro)"
          description="Alternate focused work sessions with short, restorative breaks."
          icon={<Timer className="w-6 h-6" />}
          gradient="bg-[#d9f5ee]"
          hoverColor="text-[#267861]"
        />
      </div>
    </div>
  );
};
