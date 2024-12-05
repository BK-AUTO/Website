<template>
  <div>
    <Loading :is-loading="isLoading" />
    <PageHeader :subLinks="['Trang chủ']" mainLink="Dự án" title="Quản lý Dự án" />
    <div class="page-content">
      <div class="row">
        <div class="col-12 mb-3">
          <a-button type="primary" @click="redirectToCreateProjectPage"> Tạo mới</a-button>
        </div>
        <div class="col-12 mb-3">
          <a-table :dataSource="projectData" :columns="projectColumns">
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'index'">
                <span> {{ projectData?.length - index }} </span>
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
import ProjectService from '@/services/ProjectService';
import router from '@/router';

useTitle('menu.project-manage');
const isLoading = ref(false);

const projectData = ref([]);

const redirectToDetailPage = (id) => {
  router.push('/project/manage/' + id);
};
const redirectToCreateProjectPage = () => {
  router.push('/project/create');
};

onMounted(() => {
  getProject();
});

const getProject = async () => {
  try {
    const response = await ProjectService.getAllProject();
    projectData.value = response;
  } catch (error) {
    console.error('Error getting project:', error);
  }
};

const projectColumns = [
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
.project-thumbnail {
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
