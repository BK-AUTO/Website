import { defineStore } from 'pinia';

export const useAuthenticationStore = defineStore('authentication_state', {
  persist: true,
  state: () => ({
    user: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
  actions: {
    setUser(user) {
      this.user = user;
    }
  }
});
