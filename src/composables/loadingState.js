import { ref } from 'vue';

export const isAppLoading = ref(true);

export function useLoadingState() {
  return { isAppLoading };
}