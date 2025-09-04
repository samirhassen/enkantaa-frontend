import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

interface ApiRequestConfig extends AxiosRequestConfig {
  token?: string;
}

class ApiService {
  private static instance: AxiosInstance;

  private static getInstance(): AxiosInstance {
    if (!ApiService.instance) {
      const baseURL =
        import.meta.env.VITE_API_BASE_URL || "https://behiwot.com";

      ApiService.instance = axios.create({
        baseURL,
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Request interceptor to add auth token
      ApiService.instance.interceptors.request.use(
        (config) => {
          const token = localStorage.getItem("authToken");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );

      // Response interceptor for error handling
      ApiService.instance.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            localStorage.removeItem("authToken");
            window.location.reload();
          }
          return Promise.reject(error);
        }
      );
    }
    return ApiService.instance;
  }

  static async get<T = any>(
    url: string,
    config?: ApiRequestConfig
  ): Promise<AxiosResponse<T>> {
    const instance = ApiService.getInstance();
    return instance.get<T>(url, config);
  }

  static async post<T = any>(
    url: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<AxiosResponse<T>> {
    const instance = ApiService.getInstance();
    return instance.post<T>(url, data, config);
  }

  static async put<T = any>(
    url: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<AxiosResponse<T>> {
    const instance = ApiService.getInstance();
    return instance.put<T>(url, data, config);
  }

  static async delete<T = any>(
    url: string,
    config?: ApiRequestConfig
  ): Promise<AxiosResponse<T>> {
    const instance = ApiService.getInstance();
    return instance.delete<T>(url, config);
  }

  static async patch<T = any>(
    url: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<AxiosResponse<T>> {
    const instance = ApiService.getInstance();
    return instance.patch<T>(url, data, config);
  }

  static setAuthToken(token: string): void {
    localStorage.setItem("authToken", token);
    const instance = ApiService.getInstance();
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  static getAuthToken(): void {
    localStorage.getItem("authToken");
  }

  static removeAuthToken(): void {
    localStorage.removeItem("authToken");
    const instance = ApiService.getInstance();
    delete instance.defaults.headers.common["Authorization"];
  }
}

export default ApiService;
