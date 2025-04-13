import axiosInstance from '@/composables/axios.js';
import { navigateToLogin } from "@/composables/navigation.js";
import { useAuthenticationStore } from "@/stores/authentication.js";

export default {

  async login(data) {
    const authenticationStore = useAuthenticationStore();
    const response = await axiosInstance.post('/authentication/login', data);
    const {userName} = response.data;
    authenticationStore.setUser(userName);
    return response.data;
  },

  async logout(csrfToken) {
    const authenticationStore = useAuthenticationStore();
    try {
      await axiosInstance.post('/authentication/logout', { _csrf: csrfToken });
      authenticationStore.setUser(null);
      await navigateToLogin();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

};
