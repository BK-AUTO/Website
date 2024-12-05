<template>
  <div
    class="profile-image"
    :style="{
      backgroundImage: `linear-gradient(0deg, rgba(1, 8, 9, 0.8), rgba(0, 0, 0, 0)), url(${thumbnail})`,
    }"
  >
    <div class="name">
      {{ name }}
    </div>
    <p>{{ title }}</p>
    <div>Email: {{ email }}</div>
  </div>
</template>

<script setup>
defineProps({
  thumbnail: String,
  title: String,
  name: String,
  email: String,
});
</script>

<style lang="scss" scoped>
.profile-image {
  background-color: red;
  width: 100%;
  min-height: 360px;
  background-position: center;
  background-size: cover;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: white;
  .name {
    font-family: $vietnam-font-2;
    font-size: 18px;
    line-height: 2;
    font-weight: bold;
  }
}
</style>
