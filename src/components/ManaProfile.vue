<template>
    <div class="profile-card" @click="showFullData = !showFullData">
      <!-- Profile image -->
      <div
        class="profile-image"
        :style="{
          backgroundImage: `url(${thumbnail})`,
        }"
      ></div>
  
      <!-- Shortened data -->
      <div class="shortened-data" :class="{ 'hide-shortened': showFullData }">
        <div class="name">{{ name }}</div>
        <p class="role">{{ role1 }}</p>
      </div>
  
      <!-- Full data, shown on hover or click -->
      <div class="full-data" :class="{ 'show-full': showFullData }">
        <div class="name">{{ name }}</div>
        <p class="role">{{ role1 }}</p>
        <p class="role">{{ role2 }}</p>
        <p class="title">{{ MSSV }} - {{ title }}</p>
        <div class="email">
          Email: <a :href="`mailto:${email}`">{{ email }}</a>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    thumbnail: String,
    role1: String,
    role2: String,
    title: String,
    name: String,
    email: String,
    MSSV: String,
  });
  
  const showFullData = ref(false);
  </script>
  
  <style lang="scss" scoped>
  .profile-card {
    position: relative;
    width: 100%;
    height: auto; /* Allow height to adjust based on content */
    border-radius: 10px;
    overflow: hidden;
    color: white;
    cursor: pointer;
  }
  
  .profile-image {
    width: 100%;
    height: 400px; /* Set a fixed height for the image */
    background-size: cover;
    background-position: center;
    z-index: 1;
  }
  
  .shortened-data,
  .full-data {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    padding: 15px;
    z-index: 2;
    transition: opacity 0.3s ease-in-out;
  }
  
  .full-data {
    background-color: rgba(0, 0, 0, 0.8);
    display: none;
    z-index: 3;
  }
  
  .full-data.show-full {
    display: block;
  }
  
  .shortened-data.hide-shortened {
    display: none;
  }
  
  .name {
    font-family: 'Arial', sans-serif;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .role,
  .title,
  .email {
    margin: 5px 0;
    font-size: 14px;
  }
  </style>