<template>
  <div>
    <Loading :is-loading="isLoading" />
    <PageHeader
      :subLinks="[t('menu.dashboard')]"
      :mainLink="t('common.intro')"
      :title="t('common.intro')"
    />
    <div id="intro" class="page-content intro pb-0">
      <div class="subtitle">
        {{ t('intro.subtitle') }}
        <svg width="100" height="2" viewBox="0 0 60 2">
          <rect y="0.5" width="70" height="1" fill="#888a95" fill-opacity="0.8" />
        </svg>
      </div>
      <div class="title">{{ t('intro.title') }}</div>
      <p class="description">
        {{ t('intro.description1') }}
      </p>
      <p class="description">
        {{ t('intro.description2') }}
      </p>
      <div class="img-container"></div>
    </div>

    <ManagerProfiles :title="t('manager.subtitle')" class="pb-0" />
    <ConsultantProfiles :title="t('manager.subtitle2')" class="pb-0" />
    <Milestones id="milestones" />
  </div>
</template>

<script setup>
import Loading from '@/components/Loading.vue';
import PageHeader from '@/components/PageHeader.vue';
import { useTitle } from '@/composables/common.js';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ManagerProfiles from './components/ManagerProfiles.vue';
import ConsultantProfiles from './components/ConsultantProfiles.vue';
import Milestones from './components/Milestones.vue';

useTitle('menu.about');
const { t } = useI18n();
const isLoading = ref(false);
</script>

<style lang="scss" scoped>
.page-header {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.64), rgba(0, 0, 0, 0.64)),
    url('@/assets/img/background/bg-intro.jpg');
  background-size: cover;
}

.intro {
  .subtitle {
    color: $color-gray-7;
    display: flex;
    align-items: center;
    font-size: 12px;
  }
  .title {
    font-family: $vietnam-font-2;
    font-size: 30px;
    color: #181c32;
    margin-bottom: 10px;
  }
  .description {
    color: $color-gray-7;
    line-height: 1.5;
  }
  .img-container {
    background: url('@/assets/img/contact/contact1.jpg');
    background-size: cover;
    height: 600px;
    margin-top: 24px;
  }
}
</style>
