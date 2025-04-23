<template>
  <div>
    <Loading :is-loading="isLoading" />
    <div class="page-header">
      <HeaderV2></HeaderV2>
      <div class="header-content">
        <div class="row">
          <div class="col-12 col-lg-7">
            <div class="title">Câu lạc bộ BK-Auto</div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-content">
      <div class="manage-link"><a href="/news/manage">Quản lý Tin tức</a></div>
      <div class="manage-link"><a href="/project/manage">Quản lý Dự án</a></div>
      <div class="manage-link"><a href="/research/manage">Quản lý Nghiên cứu</a></div>
      <div class="manage-link"><a href="/course/manage">Quản lý Khóa học</a></div>
      <div class="manage-link"><a href="/contact/manage">Quản lý Liên hệ</a></div>
      <div class="logout-btn" @click="submitLogout">Đăng xuất</div>
    </div>
  </div>
</template>

<script setup>
import Loading from '@/components/Loading.vue';
import { useTitle } from '@/composables/common.js';
import HeaderV2 from '@/layout/AppHeaderV2.vue';
import LoginService from '@/services/LoginService';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

useTitle('menu.dashboard');
const { t } = useI18n();
const isLoading = ref(false);

const submitLogout = async () => {
  try {
    await LoginService.logout();
  } catch (error) {
    alert(error);
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
