import { apiClient } from './client';
import { Roadmap, Unit, UnitDetail, UnitTestSubmitPayload, UnitTestSubmitResponse } from '../types';
import { 
  ApiEndpoints, 
  getRoadmapUnitsEndpoint, 
  getUnitDetailsEndpoint, 
  getUnitSubmitEndpoint 
} from '../constants/routes';

export async function getRoadmapsApi(): Promise<Roadmap[]> {
  const response = await apiClient.get<Roadmap[]>(ApiEndpoints.ROADMAPS);
  return response.data;
}

export async function getRoadmapUnitsApi(roadmapId: string): Promise<Unit[]> {
  const response = await apiClient.get<Unit[]>(getRoadmapUnitsEndpoint(roadmapId));
  return response.data;
}

export async function getUnitDetailsApi(unitId: string): Promise<UnitDetail> {
  const response = await apiClient.get<UnitDetail>(getUnitDetailsEndpoint(unitId));
  return response.data;
}

export async function submitUnitTestApi(
  unitId: string,
  payload: UnitTestSubmitPayload
): Promise<UnitTestSubmitResponse> {
  const response = await apiClient.post<UnitTestSubmitResponse>(getUnitSubmitEndpoint(unitId), payload);
  return response.data;
}
