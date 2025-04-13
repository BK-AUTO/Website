import axiosInstance from '@/composables/axios.js';
import { navigateToLogin } from "@/composables/navigation.js";
import { useAuthenticationStore } from "@/stores/authentication.js";

export default {

  async login(data) {
    try {
      const authenticationStore = useAuthenticationStore();
      const response = await axiosInstance.post('/authentication/login', data);
      const {userName} = response.data;
      authenticationStore.setUser(userName);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async logout() {
    const authenticationStore = useAuthenticationStore();
    await axiosInstance.post('/authentication/logout');
    authenticationStore.setUser(null);
    await navigateToLogin();
  },

};
