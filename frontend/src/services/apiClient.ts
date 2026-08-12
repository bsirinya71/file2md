import { env } from '../config/env';
import { CustomApiError, type ApiResponse } from '../types/api';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private baseUrl: string;
  private timeoutMs: number;

  constructor() {
    this.baseUrl = env.apiBaseUrl;
    this.timeoutMs = env.apiTimeoutMs;
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${this.baseUrl}${cleanEndpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  public async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { body, params, headers, ...customConfig } = options;
    const url = this.buildUrl(endpoint, params);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    const isFormData = body instanceof FormData;
    const requestHeaders: HeadersInit = {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...headers,
    };

    const config: RequestInit = {
      ...customConfig,
      headers: requestHeaders,
      signal: controller.signal,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    };

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      // Handle raw blob/stream responses (e.g., file exports)
      const contentType = response.headers.get('content-type');
      if (contentType && (contentType.includes('application/zip') || contentType.includes('text/markdown'))) {
        if (!response.ok) {
          throw new CustomApiError('Export request failed', 'EXPORT_ERROR', response.status);
        }
        return (await response.blob()) as unknown as T;
      }

      const jsonResult: ApiResponse<T> = await response.json();

      if (!response.ok || !jsonResult.success) {
        const errorDetail = jsonResult.error;
        throw new CustomApiError(
          errorDetail?.message || 'An unexpected error occurred',
          errorDetail?.code || 'HTTP_ERROR',
          response.status
        );
      }

      if (jsonResult.data === null) {
        throw new CustomApiError('API returned empty payload', 'EMPTY_DATA');
      }

      return jsonResult.data;
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      if (error instanceof CustomApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new CustomApiError('Request timed out. Please try again.', 'TIMEOUT_ERROR');
      }

      throw new CustomApiError(
        error instanceof Error ? error.message : 'Network error or server unreachable',
        'NETWORK_ERROR'
      );
    }
  }

  public get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  public post<T>(endpoint: string, body?: unknown, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, params });
  }
}

export const apiClient = new ApiClient();