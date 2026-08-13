import { apiClient } from './client';
import { PomodoroStartPayload, PomodoroStartedResponse, PomodoroStatusResponse } from '../types';
import { ApiEndpoints } from '../constants/routes';

export async function startPomodoroApi(payload: PomodoroStartPayload): Promise<PomodoroStartedResponse> {
  const response = await apiClient.post<PomodoroStartedResponse>(ApiEndpoints.POMODORO_START, payload);
  return response.data;
}

export async function stopPomodoroApi(): Promise<{ status: string }> {
  const response = await apiClient.post<{ status: string }>(ApiEndpoints.POMODORO_STOP);
  return response.data;
}

export async function getPomodoroStatusApi(): Promise<PomodoroStatusResponse> {
  const response = await apiClient.get<PomodoroStatusResponse>(ApiEndpoints.POMODORO_STATUS);
  return response.data;
}