import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

interface HttpManagerConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

class HttpManager {
  private axiosInstance: AxiosInstance;

  constructor(config?: HttpManagerConfig) {
    this.axiosInstance = axios.create({
      baseURL: config?.baseURL || 'http://localhost:3000',
      timeout: config?.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {

          console.error('Error response:', error.response.data);
          console.error('Status:', error.response.status);
        } else if (error.request) {

          console.error('Error request:', error.request);
        } else {

          console.error('Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  // GET request
  async get<T = any>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(endpoint, config);
  }

  // POST request
  async post<T = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(endpoint, data, config);
  }

  // PUT request
  async put<T = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(endpoint, data, config);
  }

  // PATCH request
  async patch<T = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(endpoint, data, config);
  }

  // DELETE request
  async delete<T = any>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(endpoint, config);
  }

  setHeader(key: string, value: string): void {
    this.axiosInstance.defaults.headers.common[key] = value;
  }

  removeHeader(key: string): void {
    delete this.axiosInstance.defaults.headers.common[key];
  }

  getInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

const httpManager = new HttpManager();

export default httpManager;
export { HttpManager };

