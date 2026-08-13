export interface Roadmap {
  id: string;
  title: string;
}

export interface Unit {
  id: string;
  roadmap_id: string;
  title: string;
  order: number;
  locked: boolean;
  completed: boolean;
}

export interface Resource {
  id: string;
  url: string;
  title: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
}

export interface UnitDetail extends Unit {
  resources: Resource[];
  test_available: boolean;
  questions: Question[];
}

export interface UnitTestSubmitPayload {
  answers: { question_id: string; selected_option_index: number }[];
}

export interface UnitTestSubmitResponse {
  passed: boolean;
  score: number;
  incorrect_question_numbers: number[];
  correct_count?: number;
  total_questions?: number;
  topics_completed?: number;
}
