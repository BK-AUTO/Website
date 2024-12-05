<template>
  <div class="poster">
    <div class="title">{{ title }}</div>
    <div class="subtitle">
      <div class="item">{{ time }}</div>
      <div class="item">{{ date }}</div>
      <div class="item">{{ place }}</div>
    </div>
    <img :src="thumbnail" />
  </div>
</template>
<script setup>
defineProps({
  date: String,
  title: String,
  time: String,
  place: String,
  thumbnail: String,
});
</script>
<style lang="scss" scoped>
.calendar {
  width: 72px;
  height: 72px;
  border: 1px solid $color-primary;
}
</style>
