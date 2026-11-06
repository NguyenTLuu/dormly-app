export interface ApiResponse<T> {
  code: number;
  message?: string;
  result: T;
}

export interface ApiErrorResponse {
  code?: number;
  message?: string;
}