/**
 * Standard API Response Wrapper matching Backend Specification
 */
export interface ApiErrorDetail {
  code: string;
  message: string;
  status_code?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiErrorDetail | null;
}

export class CustomApiError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', statusCode?: number) {
    super(message);
    this.name = 'CustomApiError';
    this.code = code;
    this.statusCode = statusCode;
  }
}