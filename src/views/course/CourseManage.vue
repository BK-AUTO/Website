<template>
  <div>
    <Loading :is-loading="isLoading" />
    <PageHeader :subLinks="['Trang chủ']" mainLink="Khóa học" title="Quản lý Khóa học" />
    <div class="page-content">
      <div class="row">
        <div class="col-12 mb-3">
          <a-button type="primary" @click="redirectToCreateCoursePage"> Tạo mới</a-button>
        </div>
        <div class="col-12 mb-3">
          <a-table :dataSource="courseData" :columns="courseColumns">
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'index'">
                <span> {{ courseData?.length - index }} </span>
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
import CourseService from '@/services/CourseService';
import router from '@/router';

useTitle('menu.course-manage');
const isLoading = ref(false);

const courseData = ref([]);

const redirectToDetailPage = (id) => {
  router.push('/course/manage/' + id);
};
const redirectToCreateCoursePage = () => {
  router.push('/course/create');
};

onMounted(() => {
  getCourse();
});

const getCourse = async () => {
  try {
    const response = await CourseService.getAllCourse();
    courseData.value = response;
  } catch (error) {
    console.error('Error getting course:', error);
  }
};

const courseColumns = [
  {
    title: 'STT',
    key: 'index',
  },
  {
    title: 'Tiêu đề',
    dataIndex: 'title',
    key: 'title',
  },
];
</script>

<style scoped>
.course-thumbnail {
  max-width: 30%;
  height: auto;
}
</style>

<style lang="scss" scoped>
.page-header {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.64), rgba(0, 0, 0, 0.64)),
    url('@/assets/img/background/bg-course.webp');
  background-size: cover;
}
</style>
