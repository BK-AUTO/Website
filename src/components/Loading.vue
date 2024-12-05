<template>
  <a-spin v-if="isLoading" size="large" :indicator="indicator" class="loading-spinner" />
</template>
<script setup>
import { LoadingOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';

defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  indicator: {
    type: Object,
    default: h(LoadingOutlined, {
      style: {
        fontSize: '72px',
      },
      spin: true,
    }),
  },
});
</script>

<style lang="scss" scoped>
.loading-spinner {
  height: 100vh;
  width: 100vw;
  justify-content: space-around;
  text-align: center;
  vertical-align: middle;
  align-items: center;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  backdrop-filter: brightness(0.7);
  color: $color-green-base;
}
</style>
