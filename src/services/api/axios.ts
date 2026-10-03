import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/authStore';

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // cookie httpOnly de refresh
});

api.interceptors.request.use((config) => {
  const token = useAuthStore().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 → tenta renovar com o cookie e refaz a requisição original uma vez.
api.interceptors.response.use(null, async (error: AxiosError) => {
  const auth = useAuthStore();
  const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
  const isAuthRoute = original?.url?.includes('/auth/');

  if (error.response?.status === 401 && original && !original._retry && !isAuthRoute) {
    original._retry = true;
    try {
      await auth.refresh();
      return api(original);
    } catch {
      await auth.logout();
      window.location.assign('/');
    }
  }
  return Promise.reject(error);
});
