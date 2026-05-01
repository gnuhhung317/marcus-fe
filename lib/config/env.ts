// const DEFAULT_API_BASE_URL = 'http://200.200.201.4:8081/api/v1';
const DEFAULT_API_BASE_URL = 'http://localhost:8080/api/v1';

export const ENV = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  NODE_ENV: process.env.NODE_ENV ?? 'development',
};

export function getApiBaseUrl() {
  return ENV.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '');
}

export const isProduction = ENV.NODE_ENV === 'production';
