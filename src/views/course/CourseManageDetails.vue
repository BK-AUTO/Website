<template>
  <div>
    <Loading :is-loading="isLoading" />
    <PageHeader :subLinks="['Trang chủ']" mainLink="Khóa học" title="Quản lý Khóa học" />
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
          <a-button type="primary" @click="submitCourse"> Lưu thay đổi</a-button>
        </div>
        <div class="action mt-4 text-center">
          <a-popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            ok-text="Có"
            cancel-text="Không"
            @confirm="handleDelete()"
          >
            <a-button danger> Xóa khóa học </a-button>
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
import CourseService from '@/services/CourseService';
import { useRoute } from 'vue-router';
import router from '@/router';

const route = useRoute();
const courseId = route.params.id;

useTitle('menu.dashboard');
const { t } = useI18n();
const isLoading = ref(false);

const quill = ref(null);
const publishDate = ref();
const courseContent = ref();
const previewImage = ref();
const thumbnail = ref();

const formState = reactive({
  title: '',
  topics: '',
  difficulty: 5,
  price: 0,
});

onMounted(() => {
  getCourse();
});

const getCourse = async () => {
  try {
    const response = await CourseService.getCourseById(courseId);
    if (response.thumbnail) {
      previewImage.value = `data:image/jpeg;base64,${response.thumbnail}`;
    }
    formState.title = response.title;
    formState.topics = response.topics;
    formState.difficulty = response.difficulty;
    formState.price = response.price;
    formState.summary = response.summary;
    publishDate.value = formatDateString(response?.publishDate);
    if (response.content) {
      const data = JSON.parse(response.content);
      quill.value.setContents(data.ops);
    }
  } catch (error) {
    alert('Có lỗi xảy ra');
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

const submitCourse = async () => {
  try {
    const data = {
      title: formState.title,
      topics: formState.topics,
      difficulty: formState.difficulty,
      price: formState.price,
      content: JSON.stringify(courseContent.value) || '',
    };
    const response = await CourseService.putCourse(courseId, data);

    const formData = new FormData();
    let responseWithImage;
    if (thumbnail.value) {
      formData.append('thumbnail', thumbnail.value);
      responseWithImage = await CourseService.uploadImage(response.id, formData);
    } else responseWithImage = response;

    alert('Lưu khóa học ' + responseWithImage.title + ' thành công ');
    router.push('/course/manage');
  } catch (error) {
    alert('Có lỗi xảy ra');
  }
};

const handleDelete = async () => {
  try {
    await CourseService.deleteCourse(courseId);

    alert('Đã xóa khóa học');
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
