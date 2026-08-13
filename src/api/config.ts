const STORAGE_KEY = 'api_base_url';
const DEFAULT_URL = 'http://192.168.79.156:8000';

export function getApiBaseUrl(): string {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return saved;
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) return envUrl;
  return DEFAULT_URL;
}

export function setApiBaseUrl(url: string): void {
  localStorage.setItem(STORAGE_KEY, url);
  window.location.reload();
}
