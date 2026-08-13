export interface User {
  id: string;
  nickname: string;
  knowledge_points: number;
  streak_count: number;
  last_active_date?: string;
  topics_completed: number;
  created_at?: string;
}

export interface AuthResponse {
  token: string;
  user_id: string;
}

export interface LoginPayload {
  nickname: string;
  password: string;
}

export interface RegisterPayload {
  nickname: string;
  password: string;
}
