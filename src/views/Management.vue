<template>
  <div>
    <Loading :is-loading="isLoading" />
    <div class="page-header">
      <HeaderV2></HeaderV2>
      <div class="header-content">
        <div class="row">
          <div class="col-12 col-lg-7">
            <div class="title">Câu lạc bộ BK Auto</div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-content">
      <div class="manage-link">
        <router-link to="/news/manage">{{ t('menu.news-manage') }}</router-link>
      </div>
      <div class="manage-link">
        <router-link to="/project/manage">{{ t('menu.project-manage') }}</router-link>
      </div>
      <div class="manage-link">
        <router-link to="/research/manage">{{ t('menu.research-manage') }}</router-link>
      </div>
      <div class="manage-link">
        <router-link to="/course/manage">{{ t('menu.course-manage') }}</router-link>
      </div>
      <div class="manage-link">
        <router-link to="/contact/manage">{{ t('menu.contact-manage') }}</router-link>
      </div>
      <div class="logout-btn" @click="handleLogout">{{ t('common.logout') }}</div>
    </div>
  </div>
</template>

<script setup>
import Loading from '@/components/Loading.vue';
import { useTitle, showNotificationError } from '@/composables/common.js';
import HeaderV2 from '@/layout/AppHeaderV2.vue';
import LoginService from '@/services/LoginService';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

useTitle('menu.dashboard');
const { t } = useI18n();
const isLoading = ref(false);
const axiosInstance = (await import('@/composables/axios')).default;

const refreshCsrfToken = async () => {
  try {
    const response = await fetch('/api/csrf-token', {
      credentials: 'include'
    });
    const data = await response.json();
    if (data.token) {
      axiosInstance.defaults.headers.common['X-CSRF-TOKEN'] = data.token;
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

// Get initial CSRF token
const fetchCsrfToken = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/csrf-token`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    return null;
  }
};

const handleLogout = async () => {
  try {
    isLoading.value = true;
    await LoginService.logout();
  } catch (error) {
    if (error.response?.status === 403) {
      const refreshed = await refreshCsrfToken();
      if (!refreshed) {
        window.location.reload();
        return;
      }
      try {
        await LoginService.logout();
      } catch (retryError) {
        window.location.reload();
      }
    } else {
      showNotificationError(t, t('error.genericError'));
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.page-header {
  height: 240px;
  background: #000000a3;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.64), rgba(0, 0, 0, 0.64)),
    url('@/assets/img/background/bg-default.webp');
  background-size: cover;

  .title {
    font-family: $vietnam-font-2;
    font-size: 40px;
    margin-top: 60px;
  }
}
.page-content {
  padding-top: 30px;
  padding-bottom: 30px;
  .manage-link {
    margin-bottom: 14px;
    font-size: 18px;
    font-weight: 500;
  }
  .logout-btn {
    margin-top: 16px;
    font-size: 16px;
    font-weight: 500;
    font-family: $vietnam-font-2;
    cursor: pointer;
    text-align: right;
    text-decoration: underline;
  }
}
</style>
