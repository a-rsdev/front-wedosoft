  export type PomodoroStatus = 'running' | 'finished' | 'cancelled' | 'stopped';

  export interface PomodoroStartPayload {
  duration_seconds: number;
}

export interface PomodoroStartedResponse {
  session_id: string;
  started_at: string;
  duration_seconds: number;
}

export interface PomodoroStatusResponse {
  is_running: boolean;
}
