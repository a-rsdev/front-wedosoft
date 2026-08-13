import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { startPomodoroApi, stopPomodoroApi, getPomodoroStatusApi } from '../api/pomodoroApi';
import { TimerCircle } from '../components/pomodoro/TimerCircle';
import { DurationPresets } from '../components/pomodoro/DurationPresets';
import { Coffee, Play, Square, Timer } from 'lucide-react';

type TimerMode = 'work' | 'rest';

const DEFAULT_DURATION: Record<TimerMode, number> = {
  work: 25 * 60,
  rest: 5 * 60
};

export const PomodoroPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<TimerMode>('work');
  const [duration, setDuration] = useState<number>(DEFAULT_DURATION.work);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(DEFAULT_DURATION.work);
  const [loading, setLoading] = useState<boolean>(false);
  const endTimeRef = useRef<number | null>(null);
  const completionHandledRef = useRef<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const alarmOscillatorsRef = useRef<OscillatorNode[]>([]);

  const prepareAudio = async () => {
    if (!('AudioContext' in window)) return;
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  };

  const cancelAlarm = useCallback(() => {
    alarmOscillatorsRef.current.forEach((oscillator) => {
      try {
        oscillator.stop();
      } catch {
        // An oscillator that already ended does not need to be stopped.
      }
    });
    alarmOscillatorsRef.current = [];
  }, []);

  const scheduleAlarm = useCallback((secondsUntilEnd: number) => {
    const audioContext = audioContextRef.current;
    if (!audioContext || audioContext.state === 'closed') return;

    cancelAlarm();
    const alarmStart = audioContext.currentTime + secondsUntilEnd;

    [0, 0.4, 0.8].forEach((offset, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const start = alarmStart + offset;

      oscillator.type = 'sine';
      oscillator.frequency.value = index === 1 ? 740 : 880;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.35, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.3);
      alarmOscillatorsRef.current.push(oscillator);
    });
  }, [cancelAlarm]);

  const completeTimer = useCallback(() => {
    if (completionHandledRef.current) return;
    completionHandledRef.current = true;
    endTimeRef.current = null;
    setIsRunning(false);

    if (mode === 'work') {
      setMode('rest');
      setDuration(DEFAULT_DURATION.rest);
      setRemainingSeconds(DEFAULT_DURATION.rest);
      showToast('success', 'Focus session completed!', 'Time for a break.');
    } else {
      setMode('work');
      setDuration(DEFAULT_DURATION.work);
      setRemainingSeconds(DEFAULT_DURATION.work);
      showToast('success', 'Break completed!', 'Ready for another focus session?');
    }
  }, [mode, showToast]);

  useEffect(() => {
    if (!isRunning) return;

    const updateCountdown = () => {
      if (endTimeRef.current === null) return;
      const secondsLeft = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
      setRemainingSeconds(secondsLeft);
      if (secondsLeft === 0) completeTimer();
    };

    updateCountdown();
    const tick = window.setInterval(updateCountdown, 250);
    document.addEventListener('visibilitychange', updateCountdown);

    return () => {
      window.clearInterval(tick);
      document.removeEventListener('visibilitychange', updateCountdown);
    };
  }, [isRunning, completeTimer]);

  useEffect(() => {
    if (!user || mode !== 'work') return;

    let active = true;
    const fetchStatus = async () => {
      try {
        const response = await getPomodoroStatusApi();
        if (active) setIsRunning(response.is_running);
      } catch {
        // The local timer remains usable if status synchronization is unavailable.
      }
    };

    void fetchStatus();
    const poll = window.setInterval(fetchStatus, 30_000);
    return () => {
      active = false;
      window.clearInterval(poll);
    };
  }, [user, mode]);

  const selectMode = (nextMode: TimerMode) => {
    if (isRunning || nextMode === mode) return;
    const nextDuration = DEFAULT_DURATION[nextMode];
    setMode(nextMode);
    setDuration(nextDuration);
    setRemainingSeconds(nextDuration);
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      try {
        await prepareAudio();
      } catch {
        // Audio support should never prevent the timer itself from starting.
      }

      if (mode === 'work') {
        await startPomodoroApi({ duration_seconds: duration });
      }

      endTimeRef.current = Date.now() + duration * 1000;
      completionHandledRef.current = false;
      scheduleAlarm(duration);
      setIsRunning(true);
      setRemainingSeconds(duration);
      showToast('success', mode === 'work' ? 'Focus session started' : 'Break started', `${Math.round(duration / 60)} min`);
    } catch (error: any) {
      showToast('error', 'Failed to start session', error?.response?.data?.error || 'POMODORO_START_ERROR');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      if (mode === 'work') {
        await stopPomodoroApi();
      }

      cancelAlarm();
      endTimeRef.current = null;
      completionHandledRef.current = false;
      setIsRunning(false);
      setRemainingSeconds(duration);
      showToast('info', mode === 'work' ? 'Focus session stopped' : 'Break stopped');
    } catch (error: any) {
      showToast('error', 'Failed to stop session', error?.response?.data?.error || 'POMODORO_STOP_ERROR');
    } finally {
      setLoading(false);
    }
  };

  const handleDurationSelect = (seconds: number) => {
    setDuration(seconds);
    setRemainingSeconds(seconds);
  };

  const isWork = mode === 'work';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Timer className="w-8 h-8 text-emerald-400" />
          Focus Timer
        </h1>
        <p className="text-sm text-slate-400 mt-1">Focus deeply, then take a short break.</p>
      </div>

      <div className="max-w-xl mx-auto">
        <div className="glass-panel rounded-3xl p-8 border border-slate-800 text-center space-y-8 shadow-2xl">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-900 border border-slate-800 p-1.5">
            <button
              type="button"
              onClick={() => selectMode('work')}
              disabled={isRunning}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all ${
                isWork ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-500 hover:text-slate-300'
              } disabled:cursor-not-allowed`}
            >
              <Timer className="w-4 h-4" /> Focus
            </button>
            <button
              type="button"
              onClick={() => selectMode('rest')}
              disabled={isRunning}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all ${
                !isWork ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
              } disabled:cursor-not-allowed`}
            >
              <Coffee className="w-4 h-4" /> Rest
            </button>
          </div>

          <div className="flex justify-center">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              isRunning ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
            }`}>
              {isRunning ? `${isWork ? 'FOCUS' : 'REST'} IN PROGRESS` : 'READY'}
            </span>
          </div>

          <TimerCircle remainingSeconds={remainingSeconds} duration={duration} isRunning={isRunning} />

          {!isRunning && (
            <DurationPresets
              defaultMinutes={isWork ? 25 : 5}
              selected={duration}
              onSelect={handleDurationSelect}
            />
          )}

          {!isRunning ? (
            <button
              onClick={handleStart}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-[#c7f43a] hover:bg-[#b9e72d] text-[#1c2a1d] font-extrabold text-sm shadow-xl shadow-lime-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start {isWork ? 'Focus' : 'Rest'}</span>
            </button>
          ) : (
            <button
              onClick={handleStop}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-[#fff] font-extrabold text-sm shadow-xl shadow-rose-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Square className="w-5 h-5 fill-current" />
              <span>Stop {isWork ? 'Focus' : 'Rest'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
