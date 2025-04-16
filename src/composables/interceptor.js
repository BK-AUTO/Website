import { navigateToLogin } from "@/composables/navigation.js";
import axiosInstance from './axios.js';
import LoginService from "@/services/LoginService.js";

export const sessionInterceptor = () => {
  axiosInstance.interceptors.response.use(
    async response => {
      return response;
    },
    async error => {
      const originalRequest = error.config;

      // Handle 401 Unauthorized
      if (error.response?.status === 401) {
        await LoginService.logout();
        await navigateToLogin();
        return Promise.reject(error);
      }

      // Handle 403 Forbidden (CSRF token issue)
      if (error.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          // Try to get a new CSRF token
          const response = await fetch(`${axiosInstance.defaults.baseURL}/csrf-token`, {
            credentials: 'include'
          });
          const { token } = await response.json();
          
          // Update the token in headers
          originalRequest.headers['X-CSRF-TOKEN'] = token;
          
          // Retry the original request
          return axiosInstance(originalRequest);
        } catch (retryError) {
          console.error('Failed to refresh CSRF token:', retryError);
          return Promise.reject(retryError);
        }
      }

      return Promise.reject(error);
    }
  );
};
