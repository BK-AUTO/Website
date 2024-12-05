<template>
  <div>
    <Loading :is-loading="isLoading" />
    <PageHeader :subLinks="['Trang chủ']" mainLink="Nghiên cứu" title="Quản lý Nghiên cứu" />
    <div class="page-content">
      <div class="row">
        <div class="col-12 mb-3">
          <a-button type="primary" @click="redirectToCreateResearchPage"> Tạo mới</a-button>
        </div>
        <div class="col-12 mb-3">
          <a-table :dataSource="researchData" :columns="researchColumns">
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'index'">
                <span> {{ researchData?.length - index }} </span>
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
import ResearchService from '@/services/ResearchService';
import router from '@/router';

useTitle('menu.research-manage');
const isLoading = ref(false);

const researchData = ref([]);

const redirectToDetailPage = (id) => {
  router.push('/research/manage/' + id);
};
const redirectToCreateResearchPage = () => {
  router.push('/research/create');
};

onMounted(() => {
  getResearch();
});

const getResearch = async () => {
  try {
    const response = await ResearchService.getAllResearch();
    researchData.value = response;
  } catch (error) {
    console.error('Error getting research:', error);
  }
};

const researchColumns = [
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
];
</script>

<style scoped>
.research-thumbnail {
  max-width: 30%;
  height: auto;
}
</style>

<style lang="scss" scoped>
.page-header {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.64), rgba(0, 0, 0, 0.64)),
    url('@/assets/img/background/bg-research.jpg');
  background-size: cover;
}
</style>
