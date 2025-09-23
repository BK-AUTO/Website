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
            <div class="action-buttons">
              <a-button type="primary" @click="redirectToAboutPage">
                <span>{{ t('common.accessNow') }}</span>
                <ArrowRightOutlined />
              </a-button>
              <a-button 
                size="large"
                @click="redirectToRecruitment"
                class="recruitment-button"
              >
                <span>
                  <span>{{ t('menu.memberRecruitment') }}</span>
                </span>
                <UserAddOutlined />
              </a-button>
            </div>
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
import { ArrowRightOutlined, UserAddOutlined } from '@ant-design/icons-vue';
import router from '@/router';

useTitle('menu.dashboard');
const { t } = useI18n();
const isLoading = ref(false);

const redirectToAboutPage = () => {
  router.push('/about-us');
};

const redirectToRecruitment = () => {
  router.push('/member-recruitment');
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

  .action-buttons {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    
    .recruitment-button {
      background: #3ac569 !important;
      border: none !important;
      border-radius: 0 !important;
      font-weight: 600;
      font-size: 16px;
      height: 50px;
      padding: 0 24px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      
      &:hover {
        background: #2d9d4a !important;
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(58, 197, 105, 0.4);
      }
      
      &:active {
        transform: translateY(-1px);
        box-shadow: 0 3px 10px rgba(58, 197, 105, 0.6);
      }
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s ease;
      }
      
      &:hover::before {
        left: 100%;
      }
      
      span {
        display: flex;
        align-items: center;
        gap: 8px;
        position: relative;
        z-index: 1;
      }
    }
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
    }
    50% {
      box-shadow: 0 4px 25px rgba(255, 107, 107, 0.6);
    }
    100% {
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
    }
  }
}
</style>
