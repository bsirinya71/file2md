interface EnvConfig {
  apiBaseUrl: string;
  apiTimeoutMs: number;
}

export const env: EnvConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  apiTimeoutMs: Number(import.meta.env.VITE_API_TIMEOUT_MS) || 30000,
};