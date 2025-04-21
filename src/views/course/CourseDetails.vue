<template>
  <div>
    <Loading :is-loading="isLoading" />
    <PageHeader
      :subLinks="[t('menu.dashboard'), t('menu.course')]"
      :mainLink="formState?.title"
      :title="t('menu.course')"
    />
    <div class="page-content">
      <div class="row">
        <div class="col-12 mb-3">
          <div class="row">
            <div class="col-6 col-md-4">
              <img v-if="previewImage" :src="previewImage" class="uploading-image" />
              <img v-else src="@/assets/img/background/bg-bkauto.webp" class="uploading-image" />
            </div>
            <div class="col-6 col-md-8">
              <div class="title">{{ formState.title }}</div>
              <div class="code"># {{ formState.id }}</div>
              <div class="difficulty">
                <a-rate :value="formState.difficulty" disabled />
              </div>
              <div class="category">
                <a-tag
                  v-for="(topic, index) in formState.topics.split(',')"
                  color="green"
                  class="category-tag"
                >
                  {{ topic }}
                </a-tag>
              </div>
              <div class="price">
                <span>{{ formState.price.toLocaleString() }} đ</span>
              </div>
              <a-button type="primary" @click="redirectToContactPage">
                {{ t('common.registerNow') }}
              </a-button>
            </div>
          </div>
        </div>
        <div class="col-12">
          <QuillEditor
            theme="bubble"
            :toolbar="[]"
            v-model:content="courseContent"
            @ready="quill = $event"
            readOnly="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Loading from '@/components/Loading.vue';
import PageHeader from '@/components/PageHeader.vue';
import { formatDateString, useTitle } from '@/composables/common.js';
import router from '@/router';
import CourseService from '@/services/CourseService';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';

const route = useRoute();
const courseId = route.params.id;

const redirectToContactPage = () => {
  router.push('/contact');
};

useTitle('menu.course');
const { t } = useI18n();
const isLoading = ref(false);

const quill = ref(null);
const courseContent = ref();
const previewImage = ref();
const formState = reactive({
  title: '',
  difficulty: 5,
  price: 0,
  topics: '',
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
    if (response.content) {
      const data = JSON.parse(response.content);
      quill.value.setContents(data.ops);
    }
    formState.id = response.id;
    formState.title = response.title;
    formState.topics = response.topics;
    formState.difficulty = response.difficulty;
    formState.price = response.price;
  } catch (error) {
    console.error('Error getting course:', error);
  }
};
</script>

<style lang="scss" scoped>
.page-header {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.64), rgba(0, 0, 0, 0.64)),
    url('@/assets/img/background/bg-course.webp');
  background-size: cover;
}

.page-content {
  .uploading-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .title {
    font-family: $vietnam-font;
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .code {
    color: $color-gray-7;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .difficulty {
    margin-bottom: 16px;
  }
  .category {
    margin-bottom: 12px;
    .category-tag {
      margin-bottom: 6px;
    }
  }
  .price {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 12px;
    span {
      font-family: $vietnam-font;
    }
  }
}
</style>
