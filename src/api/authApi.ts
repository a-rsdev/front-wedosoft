import { apiClient } from './client';
import { AuthResponse, LoginPayload, RegisterPayload } from '../types';
import { ApiEndpoints } from '../constants/routes';

export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(ApiEndpoints.AUTH_LOGIN, payload);
  return response.data;
}

export async function registerApi(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(ApiEndpoints.AUTH_REGISTER, payload);
  return response.data;
}
