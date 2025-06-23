import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from './types';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:30002/api';

console.log('API Base URL:', baseURL);

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    console.log('Request:', config.method?.toUpperCase(), config.url); // Debug log
    return config;
  },
  (error) => {
    console.error('Request Error:', error); // Debug log
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url); // Debug log
    return response;
  },
  (error) => {
    console.error('Response Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    }); // Debug log

    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // Redirect based on the current route
        const isCitizenRoute = window.location.pathname.startsWith('/citizen');
        const isFirstAdminPage = window.location.pathname.startsWith('/admin/first-admin');
        if (!isFirstAdminPage) {
          window.location.href = isCitizenRoute ? '/citizen/login' : '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = apiClient;
  }

  async get<T>(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (error) {
      console.error('GET Error:', url, error);
      throw error;
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      console.error('POST Error:', url, error);
      throw error;
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      const response = await this.client.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      console.error('PUT Error:', url, error);
      throw error;
    }
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      const response = await this.client.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      console.error('PATCH Error:', url, error);
      throw error;
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await this.client.delete<T>(url, config);
      return response.data;
    } catch (error) {
      console.error('DELETE Error:', url, error);
      throw error;
    }
  }
}

export const apiClientInstance = new ApiClient(); 