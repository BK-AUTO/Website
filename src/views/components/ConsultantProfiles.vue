<template>
  <div class="row page-content" :wrap="true">
    <div class="profiles-title">{{ title }}</div>
    <div class="profiles-subtitle">
      <svg width="100" height="2" viewBox="0 0 60 2">
        <rect y="0.5" width="70" height="1" fill="#888a95" fill-opacity="0.8" />
      </svg>
      {{ t('manager.title') }}
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
        :thumbnail="profile.thumbnail"
        :email="profile.email"
        :name="profile.name"
        :title="profile.title"
      />
    </div>
  </div>
</template>
<script setup>
import Profile from '@/components/Profile.vue';
import { useI18n } from 'vue-i18n';
import profile_data from '/src/assets/data/consultant_profiles.json';

const { t } = useI18n();
defineProps({
  title: String,
});

</script>
<style lang="scss" scoped>
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
</style>
