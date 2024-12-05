<template>
  <div
    :class="variantClass"
    :style="{
      backgroundImage: thumbnail
        ? `linear-gradient(0deg, rgba(1, 8, 9, 0.5), rgba(0, 0, 0, 0)), url(data:image/jpeg;base64,${thumbnail})`
        : `linear-gradient(0deg, rgba(1, 8, 9, 0.5), rgba(0, 0, 0, 0)), url(src/assets/img/background/bg-bkauto.png)`,
    }"
    @click="redirectToDetailPage"
  >
    <div class="name">
      {{ title }}
    </div>
  </div>
</template>

<script setup>
import router from '@/router';
import { computed } from 'vue';

const props = defineProps({
  id: Number,
  thumbnail: String,
  title: String,
  variant: {
    type: Number,
    default: 1,
  },
});
const variantClass = computed(() =>
  props.variant === 1 ? 'research variant-1' : 'research variant-2',
);

const redirectToDetailPage = () => {
  router.push('/research/details/' + props.id);
};
</script>

<style lang="scss" scoped>
.research {
  width: 100%;
  min-height: 360px;
  background-position: center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: white;
  cursor: pointer;
  .name {
    font-family: $vietnam-font-2;
    font-size: 17px;
    line-height: 1.5;
    padding: 14px;
  }
}
.variant-1 {
  .name {
    background-color: white;
    color: black;
  }
}
</style>
