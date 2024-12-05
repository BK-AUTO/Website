<template>
  <div>
    <Loading :is-loading="isLoading" />
    <PageHeader
      :subLinks="[t('menu.dashboard')]"
      :mainLink="t('menu.course')"
      :title="t('menu.course')"
    />
    <CurrentCourses :expandable="true" />
  </div>
</template>

<script setup>
import Loading from '@/components/Loading.vue';
import PageHeader from '@/components/PageHeader.vue';
import { useTitle } from '@/composables/common.js';
import NewsService from '@/services/NewsService';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import CurrentCourses from '../components/CurrentCourses.vue';

useTitle('menu.news');
const { t } = useI18n();
const isLoading = ref(false);

const newsList = ref([]);

onMounted(() => {
  getNewsList();
});

const getNewsList = async () => {
  try {
    const response = await NewsService.getAllNews();
    newsList.value = response;
  } catch (error) {
    console.error('Error getting news:', error);
  }
};
</script>

<style lang="scss" scoped>
.page-header {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.64), rgba(0, 0, 0, 0.64)),
    url('@/assets/img/background/bg-course.jpg');
  background-size: cover;
}
</style>
