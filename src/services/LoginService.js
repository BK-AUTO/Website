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

  async logout() {
    const authenticationStore = useAuthenticationStore();
    await axiosInstance.post('/authentication/logout');
    await navigateToLogin();
    authenticationStore.setUser(null);
  },

};
