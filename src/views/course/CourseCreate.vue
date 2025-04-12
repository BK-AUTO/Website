<template>
  <div>
    <Loading :is-loading="isLoading" />
    <PageHeader :subLinks="['Trang chủ']" mainLink="Khóa học" title="Tạo khóa học mới" />
    <div class="page-content">
      <div class="row">
        <div class="col-12">
          <a-input
            class="mb-3"
            v-model:value="formState.title"
            addonBefore="Tiêu đề"
            placeholder="v.d Đào tạo ứng dụng CNTT cơ bản trên ô tô thông minh"
          />
          <a-input
            class="mb-3"
            v-model:value="formState.topics"
            addonBefore="Chủ đề"
            placeholder="Ngăn cách bởi dấu phẩy, v.d Công nghệ, Điện tử, Cơ khí"
          />

          <a-input-number v-model:value="formState.price" addon-before="Giá" addon-after="VNĐ" />
          <div class="mt-3"></div>
          <a-input-number
            v-model:value="formState.difficulty"
            style="width: 200px"
            :min="1"
            :max="5"
            :step="1"
            addon-before="Độ khó"
            addon-after="/5"
          />

          <div class="thumbnail-container mt-3">
            <span class="me-4 fw-bold">Ảnh thumbnail</span>
            <input type="file" accept="image" @change="uploadImage" />
            <img :src="previewImage" class="uploading-image" />
          </div>

          <div class="content-writer mt-3">
            <QuillEditor
              theme="snow"
              toolbar="full"
              v-model:content="courseContent"
              @ready="quill = $event"
              placeholder="Nhập nội dung"
            />
          </div>
        </div>
        <div class="action mt-4 text-center">
          <a-button type="primary" @click="submitCourse"> Đăng khóa học</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Loading from '@/components/Loading.vue';
import PageHeader from '@/components/PageHeader.vue';
import { useTitle } from '@/composables/common.js';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { reactive } from 'vue';
import CourseService from '@/services/CourseService';
import router from '@/router';

useTitle('menu.dashboard');
const { t } = useI18n();
const isLoading = ref(false);

const quill = ref(null);
const courseContent = ref();
const previewImage = ref();
const thumbnail = ref();

const formState = reactive({
  title: '',
  topics: '',
  difficulty: 5,
  price: 0
});

const uploadImage = (e) => {
  const image = e.target.files[0];
  thumbnail.value = image;
  const reader = new FileReader();
  reader.readAsDataURL(image);
  reader.onload = (e) => {
    previewImage.value = e.target.result;
  };
};

const submitCourse = async () => {
  try {
    const data = {
      title: formState.title,
      topics: formState.topics,
      difficulty: formState.difficulty,
      price: formState.price,
      content: JSON.stringify(courseContent.value) || '',
    };
    const response = await CourseService.createCourse(data);

    const formData = new FormData();
    let responseWithImage;
    if (thumbnail.value) {
      formData.append('thumbnail', thumbnail.value);
      responseWithImage = await CourseService.uploadImage(response.id, formData);
    } else responseWithImage = response;

    alert('Tạo khóa học ' + responseWithImage.title + ' thành công ');
    router.push('/course/manage');
  } catch (error) {
    alert('Có lỗi xảy ra');
  }
};
</script>

<style lang="scss" scoped>
.page-header {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.64), rgba(0, 0, 0, 0.64)),
    url('@/assets/img/background/bg-course.webp');
  background-size: cover;
}
</style>
