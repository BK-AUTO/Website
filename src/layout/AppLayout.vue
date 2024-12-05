<template>
  <a-layout style="min-height: 100vh">
    <a-layout>
      <a-layout-content>
        <router-view />
      </a-layout-content>
      <Footer></Footer>
      <Copyright></Copyright>
    </a-layout>
  </a-layout>
</template>

<script setup>
import Footer from '@/layout/AppFooter.vue';
import Copyright from '@/layout/Copyright.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style lang="scss" scoped>
// .ant-layout-content {
//   display: flex;
//   justify-content: center;
//   padding-left: 15%;
//   padding-right: 15%;
// }
</style>
