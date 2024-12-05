<template>
  <div>
    <Loading :is-loading="isLoading" />
    <PageHeader :subLinks="['Trang chủ']" mainLink="Dự án" title="Dự án" />
    <div class="page-content">
      <div class="row">
        <div class="col-12">
          <a-input
            class="mb-3"
            v-model:value="formState.title"
            addonBefore="Tiêu đề"
            placeholder="v.d Cuộc thi tranh biện Giao thông Xanh năm 2030"
          />
          <a-input disabled class="mb-3" v-model:value="publishDate" addonBefore="Ngày đăng" />

          <div class="thumbnail-container">
            <span class="me-4 fw-bold">Ảnh thumbnail</span>
            <input type="file" accept="image" @change="uploadImage" />
            <img :src="previewImage" class="uploading-image" />
          </div>

          <div class="content-writer mt-3">
            <QuillEditor
              theme="snow"
              toolbar="full"
              v-model:content="projectContent"
              @ready="quill = $event"
              placeholder="Nhập nội dung"
            />
          </div>
        </div>
        <div class="action mt-4 text-center">
          <a-button type="primary" @click="submitProject"> Lưu thay đổi</a-button>
        </div>
        <div class="action mt-4 text-center">
          <a-popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            ok-text="Có"
            cancel-text="Không"
            @confirm="handleDelete()"
          >
            <a-button danger> Xóa dự án </a-button>
          </a-popconfirm>
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
import { useI18n } from 'vue-i18n';
import { reactive } from 'vue';
import ProjectService from '@/services/ProjectService';
import { useRoute } from 'vue-router';
import router from '@/router';

const route = useRoute();
const projectId = route.params.id;

useTitle('menu.dashboard');
const { t } = useI18n();
const isLoading = ref(false);

const quill = ref(null);
const publishDate = ref();
const projectContent = ref();
const previewImage = ref();
const thumbnail = ref();

const formState = reactive({
  title: '',
});

onMounted(() => {
  getProject();
});

const getProject = async () => {
  try {
    const response = await ProjectService.getProjectById(projectId);
    if (response.thumbnail) {
      previewImage.value = `data:image/jpeg;base64,${response.thumbnail}`;
    }
    formState.title = response.title;
    publishDate.value = formatDateString(response?.publishDate);
    if (response.content) {
      const data = JSON.parse(response.content);
      quill.value.setContents(data.ops);
    }
  } catch (error) {
    console.error('Error getting project:', error);
  }
};

const uploadImage = (e) => {
  const image = e.target.files[0];
  thumbnail.value = image;
  const reader = new FileReader();
  reader.readAsDataURL(image);
  reader.onload = (e) => {
    previewImage.value = e.target.result;
  };
};

const submitProject = async () => {
  try {
    const data = {
      title: formState.title,
      content: JSON.stringify(projectContent.value) || '',
    };
    const response = await ProjectService.putProject(projectId, data);

    const formData = new FormData();
    let responseWithImage;
    if (thumbnail.value) {
      formData.append('thumbnail', thumbnail.value);
      responseWithImage = await ProjectService.uploadImage(response.id, formData);
    } else responseWithImage = response;

    alert('Lưu dự án ' + responseWithImage.title + ' thành công ');
    router.push('/project/manage');
  } catch (error) {
    alert('Có lỗi xảy ra');
  }
};

const handleDelete = async () => {
  try {
    await ProjectService.deleteProject(projectId);

    alert('Đã xóa dự án');
    router.push('/project/manage');
  } catch (error) {
    alert('Có lỗi xảy ra');
  }
};
</script>

<style lang="scss" scoped>
.page-header {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.64), rgba(0, 0, 0, 0.64)),
    url('@/assets/img/background/bg-research.jpg');
  background-size: cover;
}

.page-content {
  padding-top: 80px;
  padding-bottom: 80px;
  .uploading-image {
    height: 220px;
  }
}
</style>
