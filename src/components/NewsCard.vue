<template>
  <div :class="newsClass" @click="redirectToDetailPage">
    <div
      class="news-image"
      :style="{
        backgroundImage: thumbnail
          ? `url(data:image/jpeg;base64,${thumbnail})`
          : `url(src/assets/img/background/bg-bkauto.png)`,
      }"
    ></div>
    <div class="description">
      <div class="category">
        {{ category }}
      </div>
      <div class="title">{{ title }}</div>
      <div class="date">{{ formatDateString(date) }}</div>
      <div v-if="main">
        <div class="summary">{{ summary }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import router from '@/router';
import { formatDateString } from '@/composables/common';
const props = defineProps({
  id: Number,
  category: String,
  title: String,
  thumbnail: String,
  date: String,
  summary: String,
  main: {
    type: Boolean,
    default: false,
  },
});
const newsClass = computed(() => (props.main ? 'news-class main' : 'news-class'));

const redirectToDetailPage = () => {
  router.push('/news/details/' + props.id);
};
</script>

<style lang="scss" scoped>
.news-image {
  width: 100%;
  min-height: 200px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-color: $color-gray-4;
}
.description {
  padding: 15px 10px;
  background-color: white;
  .category {
    color: $color-primary;
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 10px;
  }
  .title {
    font-family: $vietnam-font-2;
    font-size: 17px;
  }
}
.date {
  padding-top: 10px;
  color: $color-gray-7;
}
.main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .news-image {
    width: 100%;
    flex-grow: 1;
  }
  .summary {
    color: $color-gray-7;
  }
  .date {
    padding-bottom: 10px;
  }
}
</style>
