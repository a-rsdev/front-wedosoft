export enum AppRoutes {
  HOME = '/',
  AUTH = '/auth',
  ROADMAPS = '/roadmaps',
  PVP = '/pvp',
  POMODORO = '/pomodoro'
}

export enum ApiEndpoints {
  AUTH_REGISTER = '/auth/register',
  AUTH_LOGIN = '/auth/login',
  ROADMAPS = '/roadmaps',
  STREAK_PING = '/streak/ping',
  MATCHES_ROADMAPS = '/matches/roadmaps',
  MATCHES_GATE = '/matches/gate',
  MATCHES_FIND = '/matches/find',
  POMODORO_START = '/pomodoro/start',
  POMODORO_STOP = '/pomodoro/stop',
  POMODORO_STATUS = '/pomodoro/status'
}

export const getRoadmapUnitsEndpoint = (id: string) => `/roadmaps/${id}/units`;
export const getUnitDetailsEndpoint = (id: string) => `/units/${id}`;
export const getUnitSubmitEndpoint = (id: string) => `/units/${id}/test/submit`;
export const getMatchDetailsEndpoint = (id: string) => `/matches/${id}`;
export const getMatchAnswerEndpoint = (id: string) => `/matches/${id}/answer`;
export const getMatchFinishEndpoint = (id: string) => `/matches/${id}/finish`;
