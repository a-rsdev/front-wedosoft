import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppRoutes } from '../constants/routes';
import { Navbar } from '../components/Navbar';
import { AuthPage } from '../pages/AuthPage';
import { DashboardPage } from '../pages/DashboardPage';
import { RoadmapsPage } from '../pages/RoadmapsPage';
import { MatchmakingPage } from '../pages/MatchmakingPage';
import { PomodoroPage } from '../pages/PomodoroPage';

const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

const ProtectedLayout: React.FC = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f9f7]">
        <div className="w-10 h-10 border-2 border-lime-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to={AppRoutes.AUTH} replace />;
  }

  return <Outlet />;
};

export const router = createBrowserRouter([
  {
    path: AppRoutes.HOME,
    element: <RootLayout />,
    children: [
      {
        path: 'auth',
        element: <AuthPage />
      },
      {
        element: <ProtectedLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'roadmaps', element: <RoadmapsPage /> },
          { path: 'pvp', element: <MatchmakingPage /> },
          { path: 'pomodoro', element: <PomodoroPage /> }
        ]
      },
      { path: '*', element: <Navigate to={AppRoutes.HOME} replace /> }
    ]
  }
]);
