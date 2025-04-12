<template>
  <div :class="newsClass" @click="redirectToDetailPage">
    <div class="course-image">
      <img v-if="thumbnail" :src="`data:image/jpeg;base64,${thumbnail}`" />
      <img v-else src="@/assets/img/background/bg-bkauto.webp" />
    </div>

    <div class="description">
      <div>
        <span class="category">
          {{ category }}
        </span>
        <span class="date"> - {{ formatDateString(date) }}</span>
      </div>

      <div class="title">{{ title }}</div>
      <div class="summary">{{ summary }}</div>
    </div>
  </div>
</template>

<script setup>
import { formatDateString } from '@/composables/common';
import router from '@/router';
import { computed } from 'vue';
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
.news-class {
  display: flex;
  margin-bottom: 28px;
  &:hover {
    cursor: pointer;
  }
  .course-image {
    width: 35%;
    height: 210px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .description {
    width: 65%;
    padding-left: 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .category {
      color: $color-primary;
      font-weight: 500;
    }
    .title {
      font-family: $vietnam-font-2;
      margin: 10px 0;
      font-size: 20px;
    }
    .summary {
      color: $color-gray-8;
    }
    .date {
      padding-top: 10px;
      color: $color-gray-7;
    }
  }
}

.main {
  display: block;
  margin-bottom: 40px;
  .course-image {
    width: 100%;
    height: 540px;
    margin-bottom: 28px;
  }
  .description {
    width: 100%;
    padding-left: 0;
  }
}
</style>
