import { apiClient } from './client';
import { FindMatchResponse, Match, MatchAnswerPayload, MatchAnswerResponse, MatchFinishResponse, MatchmakingGate, MatchRoadmap } from '../types';
import { 
  ApiEndpoints, 
  getMatchDetailsEndpoint, 
  getMatchAnswerEndpoint, 
  getMatchFinishEndpoint 
} from '../constants/routes';

export async function getMatchRoadmapsApi(): Promise<MatchRoadmap[]> {
  const response = await apiClient.get<MatchRoadmap[]>(ApiEndpoints.MATCHES_ROADMAPS);
  return response.data;
}

export async function getMatchmakingGateApi(): Promise<MatchmakingGate> {
  const response = await apiClient.get<MatchmakingGate>(ApiEndpoints.MATCHES_GATE);
  return response.data;
}

export async function findMatchApi(roadmapId: string): Promise<FindMatchResponse> {
  const response = await apiClient.post<FindMatchResponse>(ApiEndpoints.MATCHES_FIND, {
    roadmap_id: roadmapId
  });
  return response.data;
}

export async function getMatchApi(matchId: string): Promise<Match> {
  const response = await apiClient.get<Match>(getMatchDetailsEndpoint(matchId));
  return response.data;
}

export async function submitMatchAnswerApi(
  matchId: string,
  payload: MatchAnswerPayload
): Promise<MatchAnswerResponse> {
  const response = await apiClient.post<MatchAnswerResponse>(getMatchAnswerEndpoint(matchId), payload);
  return response.data;
}

export async function finishMatchApi(matchId: string): Promise<MatchFinishResponse> {
  const response = await apiClient.post<MatchFinishResponse>(getMatchFinishEndpoint(matchId));
  return response.data;
}
