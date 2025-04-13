import { navigateToLogin } from "@/composables/navigation.js";
import axiosInstance from './axios.js';
import LoginService from "@/services/LoginService.js";
import { showNotificationError } from "@/composables/common.js";

export const sessionInterceptor = () => {
  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => response,  // Return successful responses as-is
    async (error) => {
      if (error.response) {
        // Handle 401 Unauthorized
        if (error.response.status === 401) {
          try {
            await LoginService.logout();
            await navigateToLogin();
          } catch (logoutError) {
            console.error('Logout error:', logoutError);
          }
        }
      }
      return Promise.reject(error);
    }
  );
};
