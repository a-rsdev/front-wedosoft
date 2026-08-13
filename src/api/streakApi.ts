import { apiClient } from './client';
import { StreakPingResponse } from '../types';
import { ApiEndpoints } from '../constants/routes';

export async function pingStreakApi(): Promise<StreakPingResponse> {
  const response = await apiClient.post<StreakPingResponse>(ApiEndpoints.STREAK_PING);
  return response.data;
}
