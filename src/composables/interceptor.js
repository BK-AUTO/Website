import { navigateToLogin } from "@/composables/navigation.js";
import axiosInstance from './axios.js';
import LoginService from "@/services/LoginService.js";

export const sessionInterceptor = () => {
  axiosInstance.interceptors.response.use(
      res => {
        return res;
      },
      async err => {
        const originalConfig = err.config;

        if (originalConfig.url !== '/api/authentication/login' && err.response) {
          if (err.response.status === 401) {
            alert('Phiên làm việc hết hạn, vui lòng đăng nhập')
            await navigateToLogin(); // Session expired
            await LoginService.logout();
            return;
          }
        }
        return Promise.reject(err);
      },
  );
}
