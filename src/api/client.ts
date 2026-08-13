import axios from 'axios';
import { getApiBaseUrl } from './config';

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('edutech_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

apiClient.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object') {
      if ('value' in response.data && 'error' in response.data) {
        if (response.data.error === null || response.data.error === undefined) {
          response.data = response.data.value;
        } else {
          const errDetail = response.data.error;
          const errMessage = typeof errDetail === 'string' 
            ? errDetail 
            : errDetail.code || 'API_ERROR';
          const statusCode = typeof errDetail === 'object' && errDetail !== null && 'status_code' in errDetail
            ? errDetail.status_code
            : response.status;

          return Promise.reject({
            response: {
              status: statusCode,
              data: { error: errMessage }
            }
          });
        }
      }
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.data) {
      if (typeof error.response.data.error === 'object' && error.response.data.error !== null) {
        if ('code' in error.response.data.error) {
          error.response.data = { error: error.response.data.error.code };
        }
      }
    }
    return Promise.reject(error);
  }
);
