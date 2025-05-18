// src/api/axiosConfig.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Usar la variable de entorno para la URL base
const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Creamos la instancia de Axios
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // opcional, depende de tu backend
});

// Interceptor para agregar accessToken en cada request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Interceptor para refrescar el token si da 401
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Usar la variable de entorno para la URL del refresh
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/refresh`,
          { refreshToken }
        );

        const { accessToken } = res.data as { accessToken: string };

        localStorage.setItem('accessToken', accessToken);

        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;