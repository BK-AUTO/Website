<template>
  <div>
    <Loading :is-loading="isLoading" />
    <PageHeader :subLinks="['Trang chủ']" mainLink="Tin tức" title="Quản lý Tin tức" />
    <div class="page-content">
      <div class="row">
        <div class="col-12 mb-3">
          <a-button type="primary" @click="redirectToCreateNewsPage"> Tạo mới</a-button>
        </div>
        <div class="col-12 mb-3">
          <a-table :dataSource="newsData" :columns="newsColumns">
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'index'">
                <span> {{ newsData?.length - index }} </span>
              </template>
              <template v-if="column.key === 'title'">
                <a @click="redirectToDetailPage(record.id)">
                  <span style="text-decoration: underline">{{ record.title }}</span>
                </a>
              </template>
              <template v-if="column.key === 'publishDate'">
                <span> {{ formatDateString(record.publishDate) }} </span>
              </template>
            </template>
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Loading from '@/components/Loading.vue';
import PageHeader from '@/components/PageHeader.vue';
import { formatDateString, useTitle } from '@/composables/common.js';
import { onMounted, ref } from 'vue';
import NewsService from '@/services/NewsService';
import router from '@/router';

useTitle('menu.news-manage');
const isLoading = ref(false);

const newsData = ref([]);

const redirectToDetailPage = (id) => {
  router.push('/news/manage/' + id);
};
const redirectToCreateNewsPage = () => {
  router.push('/news/create');
};

onMounted(() => {
  getNews();
});

const getNews = async () => {
  try {
    const response = await NewsService.getAllNews();
    newsData.value = response;
  } catch (error) {
    console.error('Error getting news:', error);
  }
};

const newsColumns = [
  {
    title: 'STT',
    key: 'index',
  },
  {
    title: 'Ngày đăng',
    dataIndex: 'publishDate',
    key: 'publishDate',
  },
  {
    title: 'Tiêu đề',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Chủ đề',
    dataIndex: 'topic',
    key: 'topic',
  },
];
</script>

<style scoped>
.news-thumbnail {
  max-width: 30%;
  height: auto;
}
</style>

<style lang="scss" scoped>
.page-header {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.64), rgba(0, 0, 0, 0.64)),
    url('@/assets/img/background/bg-news.jpg');
  background-size: cover;
}
</style>
