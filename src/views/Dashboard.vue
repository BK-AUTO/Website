<template>
  <div>
    <Loading :is-loading="isLoading" />
    <div class="page-header">
      <HeaderV2></HeaderV2>
      <div class="header-content">
        <div class="row">
          <div class="col-12 col-lg-7">
            <div class="subtitle1">
              {{ t('dashboard.hust') }}
              <svg width="100" height="2" viewBox="0 0 60 2">
                <rect y="0.5" width="80" height="1" fill="white" fill-opacity="0.8" />
              </svg>
            </div>
            <div class="title">{{ t('dashboard.welcome') }}</div>
            <div class="subtitle2">
              {{ t('dashboard.description') }}
            </div>
            <a-button type="primary" @click="redirectToAboutPage">
              <span>{{ t('common.accessNow') }}</span>
              <ArrowRightOutlined />
            </a-button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <Introduction class="pb-0" />
      <OurProjects />
      <Events />
      <HighlightStats class="py-0" />
      <CurrentCourses />
      <Sponsors class="py-0" />
      <ManagerProfiles :title="t('manager.subtitle')" class="pb-0" />
      <CurrentNews class="pb-0" />
      <Milestones />
    </div>
  </div>
</template>

<script setup>
import HeaderV2 from '@/layout/AppHeaderV2.vue';
import Loading from '@/components/Loading.vue';
import Events from './components/Events.vue';
import OurProjects from './components/OurProjects.vue';
import ManagerProfiles from './components/ManagerProfiles.vue';
import CurrentNews from './components/CurrentNews.vue';
import HighlightStats from '@/views/components/HighlightStats.vue';
import Sponsors from '@/views/components/Sponsors.vue';
import CurrentCourses from './components/CurrentCourses.vue';
import Milestones from './components/Milestones.vue';
import Introduction from './components/Introduction.vue';
import { useTitle } from '@/composables/common.js';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowRightOutlined } from '@ant-design/icons-vue';
import router from '@/router';

useTitle('menu.dashboard');
const { t } = useI18n();
const isLoading = ref(false);

const redirectToAboutPage = () => {
  router.push('/about-us');
};
</script>

<style lang="scss" scoped>
.page-header {
  height: 720px;
  background: #000000a3;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.64), rgba(0, 0, 0, 0.64)),
    url('@/assets/img/background/bg-default.webp');
  background-size: cover;

  .subtitle1 {
    text-transform: uppercase;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
  }
  .title {
    font-family: $vietnam-font-2;
    font-size: 44px;
    margin-bottom: 14px;
  }
  .subtitle2 {
    line-height: 20px;
    margin-bottom: 32px;
  }
}
</style>
