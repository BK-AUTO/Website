<template>
  <div>
    <Loading :is-loading="isLoading" />
    <PageHeader :subLinks="['Trang chủ']" mainLink="Nghiên cứu" title="Nghiên cứu" />
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
              v-model:content="researchContent"
              @ready="quill = $event"
              placeholder="Nhập nội dung"
            />
          </div>
        </div>
        <div class="action mt-4 text-center">
          <a-button type="primary" @click="submitResearch"> Lưu thay đổi</a-button>
        </div>
        <div class="action mt-4 text-center">
          <a-popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            ok-text="Có"
            cancel-text="Không"
            @confirm="handleDelete()"
          >
            <a-button danger> Xóa nghiên cứu </a-button>
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
import ResearchService from '@/services/ResearchService';
import { useRoute } from 'vue-router';
import router from '@/router';

const route = useRoute();
const researchId = route.params.id;

useTitle('menu.dashboard');
const { t } = useI18n();
const isLoading = ref(false);

const quill = ref(null);
const publishDate = ref();
const researchContent = ref();
const previewImage = ref();
const thumbnail = ref();

const formState = reactive({
  title: '',
});

onMounted(() => {
  getResearch();
});

const getResearch = async () => {
  try {
    const response = await ResearchService.getResearchById(researchId);
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
    console.error('Error getting research:', error);
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

const submitResearch = async () => {
  try {
    const data = {
      title: formState.title,
      content: JSON.stringify(researchContent.value) || '',
    };
    const response = await ResearchService.putResearch(researchId, data);

    const formData = new FormData();
    let responseWithImage;
    if (thumbnail.value) {
      formData.append('thumbnail', thumbnail.value);
      responseWithImage = await ResearchService.uploadImage(response.id, formData);
    } else responseWithImage = response;

    alert('Lưu nghiên cứu ' + responseWithImage.title + ' thành công ');
    router.push('/research/manage');
  } catch (error) {
    alert('Có lỗi xảy ra');
  }
};

const handleDelete = async () => {
  try {
    await ResearchService.deleteResearch(researchId);

    alert('Đã xóa nghiên cứu');
    router.push('/research/manage');
  } catch (error) {
    alert('Có lỗi xảy ra');
  }
};
</script>

<style lang="scss" scoped>
.page-header {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.64), rgba(0, 0, 0, 0.64)),
    url('@/assets/img/background/bg-research.webp');
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
