import React, { createContext, useCallback, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { User, StreakPingResponse } from '../types';
import { loginApi, registerApi } from '../api/authApi';
import { pingStreakApi } from '../api/streakApi';

interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (nickname: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (nickname: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  pingStreak: () => Promise<StreakPingResponse | null>;
  streakData: StreakPingResponse | null;
  refreshUser: (updated?: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('edutech_token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('edutech_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [streakData, setStreakData] = useState<StreakPingResponse | null>(null);
  const lastStreakSyncDate = useRef<string | null>(null);

  useEffect(() => {
    if (token && !user) {
      setUser({
        id: 'usr-default',
        nickname: 'User',
        knowledge_points: 0,
        streak_count: 1,
        topics_completed: 0
      });
    }
    setLoading(false);
  }, [token]);

  const login = async (nickname: string, password: string) => {
    try {
      const data = await loginApi({ nickname, password });
      localStorage.setItem('edutech_token', data.token);
      setToken(data.token);

      const newUser: User = {
        id: data.user_id,
        nickname,
        knowledge_points: 0,
        streak_count: 1,
        topics_completed: 0
      };
      setUser(newUser);
      localStorage.setItem('edutech_user', JSON.stringify(newUser));
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || 'An error occurred while signing in'
      };
    }
  };

  const register = async (nickname: string, password: string) => {
    try {
      const data = await registerApi({ nickname, password });
      localStorage.setItem('edutech_token', data.token);
      setToken(data.token);

      const newUser: User = {
        id: data.user_id,
        nickname,
        knowledge_points: 0,
        streak_count: 1,
        topics_completed: 0
      };
      setUser(newUser);
      localStorage.setItem('edutech_user', JSON.stringify(newUser));
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error || 'An error occurred while creating the account'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('edutech_token');
    localStorage.removeItem('edutech_user');
    setToken(null);
    setUser(null);
  };

  const pingStreak = useCallback(async () => {
    try {
      const data = await pingStreakApi();
      setStreakData(data);
      setUser((currentUser) => {
        if (!currentUser) return currentUser;
        const updatedUser = {
          ...currentUser,
          streak_count: data.streak_count,
          last_active_date: data.last_active_date
        };
        localStorage.setItem('edutech_user', JSON.stringify(updatedUser));
        return updatedUser;
      });
      return data;
    } catch (err) {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!token) {
      lastStreakSyncDate.current = null;
      return;
    }

    const getLocalDate = () => new Date().toLocaleDateString('en-CA');
    const syncStreak = () => {
      const today = getLocalDate();
      if (lastStreakSyncDate.current === today) return;

      lastStreakSyncDate.current = today;
      void pingStreak().then((data) => {
        if (!data) lastStreakSyncDate.current = null;
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') syncStreak();
    };

    let midnightTimer: number;
    const scheduleMidnightSync = () => {
      const now = new Date();
      const nextMidnight = new Date(now);
      nextMidnight.setHours(24, 0, 1, 0);
      midnightTimer = window.setTimeout(() => {
        syncStreak();
        scheduleMidnightSync();
      }, nextMidnight.getTime() - now.getTime());
    };

    syncStreak();
    scheduleMidnightSync();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearTimeout(midnightTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [token, pingStreak]);

  const refreshUser = (updated?: Partial<User>) => {
    if (user && updated) {
      const merged = { ...user, ...updated };
      setUser(merged);
      localStorage.setItem('edutech_user', JSON.stringify(merged));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        register,
        logout,
        pingStreak,
        streakData,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
