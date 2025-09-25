<template>
  <div class="row page-content" :wrap="true">
    <div class="profiles-title">{{ title }}</div>
    <div class="profiles-subtitle">
      <svg width="100" height="2" viewBox="0 0 60 2">
        <rect y="0.5" width="70" height="1" fill="#888a95" fill-opacity="0.8" />
      </svg>
      <svg width="100" height="2" viewBox="0 0 60 2">
        <rect y="0.5" width="70" height="1" fill="#888a95" fill-opacity="0.8" />
      </svg>
    </div>
    <div
      class="profile col-12 col-md-6 col-lg-4"
      v-for="(profile, index) in profile_data"
      :key="index"
    >
      <Profile
        :role1="profile.role1"
        :role2="profile.role2"
        :thumbnail="profile.thumbnail"
        :email="profile.email"
        :name="profile.name"
        :title="profile.title"
        :MSSV="profile.MSSV"
      />
    </div>
  </div>
</template>

<script setup>
import Profile from '@/components/ManaProfile.vue';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import raw_profile_data from '/src/assets/data/manager_profiles.json';

// Import all member images using glob
const memberImages = import.meta.glob('../../assets/img/member/**/*.webp', { eager: true });
const { t } = useI18n();
defineProps({
  title: String,
});

// Process profile data to resolve thumbnail URLs
const profile_data = computed(() => {
  return raw_profile_data.map(profile => {
    // Handle external URLs directly
    if (profile.thumbnail.startsWith('http')) {
      return profile;
    }

    // Extract the relative path from src/assets/img/member/
    const relativePath = profile.thumbnail.replace('src/assets/img/member/', '');
    // Construct the key for the glob import (relative path from this component)
    const globKey = `../../assets/img/member/${relativePath}`;

    if (memberImages[globKey]) {
      // Get the processed URL from the imported module
      const resolvedThumbnailUrl = memberImages[globKey].default;
      return { ...profile, thumbnail: resolvedThumbnailUrl };
    } else {
      console.warn(`Image not found for profile ${profile.name}: ${profile.thumbnail}`);
      // Optionally return a placeholder or the original path
      return { ...profile, thumbnail: '' }; // Or return profile as is
    }
  });
});
</script>

<style lang="scss" scoped>
.page-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.profiles-title {
  text-align: center;
  font-family: $vietnam-font-2;
  font-size: 28px;
  color: #181c32;
  margin-bottom: 10px;
}

.profiles-subtitle {
  color: $color-gray-7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-bottom: 20px;
}

.profile {
  min-width: 300px;
  margin-bottom: 20px;
}
</style>