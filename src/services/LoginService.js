import axiosInstance from '@/composables/axios.js';
import { navigateToLogin } from "@/composables/navigation.js";
import { useAuthenticationStore } from "@/stores/authentication.js";

export default {

  async login(data) {
    try {
      // Get CSRF token before login
      const tokenResponse = await fetch(`${axiosInstance.defaults.baseURL}/csrf-token`, {
        credentials: 'include'
      });
      const { token } = await tokenResponse.json();
      
      const authenticationStore = useAuthenticationStore();
      const response = await axiosInstance.post('/authentication/login', data, {
        headers: {
          'X-CSRF-TOKEN': token
        }
      });
      
      const {userName} = response.data;
      authenticationStore.setUser(userName);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      const authenticationStore = useAuthenticationStore();
      await axiosInstance.post('/authentication/logout');
      authenticationStore.setUser(null);
      await navigateToLogin();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

};
