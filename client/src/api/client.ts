import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { auth } from '@/config/firebase';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

type ApiResult<T> = ApiSuccess<T> | ApiError;

async function request<T>(
  method: 'get' | 'post' | 'patch',
  path: string,
  data?: unknown,
  signal?: AbortSignal,
): Promise<ApiResult<T>> {
  try {
    const response = await apiClient({ method, url: path, data, signal });
    
    // FIX 1: Return response.data directly because your backend 
    // already envelopes it with { success: true, data: ... }
    return response.data; 
  } catch (err: any) {
    if (axios.isCancel(err)) {
      return { success: false, error: { code: 'CANCELLED', message: 'Request was cancelled' } };
    }

    const axiosErr = err as AxiosError<any>;
    
    // FIX 2: If the server responded with an error structure, return it directly 
    // to match your old fetch behavior where errors were processed seamlessly.
    if (axiosErr.response?.data) {
      return axiosErr.response.data;
    }

    // Fallback for real network drops/timeout issues
    return {
      success: false,
      error: { 
        code: 'NETWORK_ERROR', 
        message: axiosErr.message || 'Network request failed' 
      },
    };
  }
}

export const api = {
  get: <T>(path: string, signal?: AbortSignal) => request<T>('get', path, undefined, signal),
  post: <T>(path: string, body: unknown, signal?: AbortSignal) => request<T>('post', path, body, signal),
  patch: <T>(path: string, body: unknown, signal?: AbortSignal) => request<T>('patch', path, body, signal),
};