export interface ErrorDetail {
  code: string;
  status_code: number;
}

export interface ApiResult<T> {
  value: T | null;
  error: ErrorDetail | string | null;
}
