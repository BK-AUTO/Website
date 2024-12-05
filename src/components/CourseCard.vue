<template>
  <div class="course" @click="redirectToDetailPage">
    <div
      class="course-image"
      :style="{
        backgroundImage: thumbnail
          ? `url(data:image/jpeg;base64,${thumbnail})`
          : `url(src/assets/img/background/bg-bkauto.png)`,
      }"
    />
    <div class="description">
      <div class="title">{{ title }}</div>
    </div>
  </div>
</template>

<script setup>
import router from '@/router';

const props = defineProps({
  id: Number,
  title: String,
  thumbnail: String,
});

const redirectToDetailPage = () => {
  router.push('/course/details/' + props.id);
};
</script>

<style lang="scss" scoped>
.course {
  width: 100%;
  min-height: 320px;
  cursor: pointer;
}
.course-image {
  width: 100%;
  min-height: 240px;
  background-position: center;
  background-size: cover;
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
</style>
