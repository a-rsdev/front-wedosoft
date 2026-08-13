export type MatchStatus = 'active' | 'finished';

export interface MatchRoadmap {
  id: string;
  title: string;
  completed_units: number;
  eligible: boolean;
  points: number;
}

export interface MatchmakingGate {
  completed_units: number;
  eligible: boolean;
}

export interface MatchQuestion {
  id: string;
  text: string;
  options: string[];
}

export interface FindMatchResponse {
  status: 'matched' | 'waiting';
  match_id?: string;
}

export interface MatchRoundResult {
  question_id: string;
  correct_option_index: number;
  your_selected_index: number;
  your_correct: boolean;
  opponent_selected_index: number;
  opponent_correct: boolean;
}

export interface Match {
  id: string;
  opponent_id: string;
  roadmap_id: string;
  status: MatchStatus;
  total_rounds: number;
  current_round: number;
  current_question: MatchQuestion | null;
  answer_deadline: string | null;
  you_answered_current: boolean;
  opponent_answered_current: boolean;
  rounds: MatchRoundResult[];
}

export interface MatchAnswerPayload {
  question_id: string;
  selected_option_index: number;
}

export interface MatchAnswerResponse {
  status: 'accepted';
}

export interface MatchFinishResponse {
  your_score: number;
  opponent_score: number;
  you_won: boolean;
  is_draw: boolean;
  your_base_points: number;
  your_streak_multiplier: number;
  your_win_multiplier: number;
  your_points_earned: number;
  your_roadmap_points_total: number;
  opponent_base_points: number;
  opponent_streak_multiplier: number;
  opponent_win_multiplier: number;
  opponent_points_earned: number;
}
