<template>
  <div>
    <Loading :is-loading="isLoading" />
    <PageHeader
      :subLinks="[t('menu.dashboard'), t('menu.news')]"
      :mainLink="formState?.title"
      :title="t('menu.news')"
    />
    <div class="page-content">
      <div class="row">
        <div class="col-12 mb-3">
          <div class="title">{{ formState.title }}</div>
          <div>
            <span class="category">
              {{ formState.topic }}
            </span>
            <span class="date"> - {{ formatDateString(formState.publishDate) }}</span>
          </div>
        </div>
        <div class="col-12">
          <QuillEditor
            theme="bubble"
            :toolbar="[]"
            v-model:content="newsContent"
            @ready="quill = $event"
            readOnly ="true"
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
import NewsService from '@/services/NewsService';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';

const route = useRoute();
const newsId = route.params.id;

useTitle('menu.news');
const { t } = useI18n();
const isLoading = ref(false);

const quill = ref(null);
const newsContent = ref();
const thumbnailUrl = ref(null);
const formState = reactive({
  title: '',
  topic: '',
  publishDate: null,
});

onMounted(() => {
  getNews();
});

const getNews = async () => {
  try {
    const response = await NewsService.getNewsById(newsId);
    if (response.thumbnail) {
      thumbnailUrl.value = `data:image/jpeg;base64,${response.thumbnail}`;
    }
    if (response.content) {
      const data = JSON.parse(response.content);
      quill.value.setContents(data.ops);
    }
    formState.title = response.title;
    formState.topic = response.topic;
    formState.publishDate = response.publishDate;
  } catch (error) {
    console.error('Error getting news:', error);
  }
};
</script>

<style lang="scss" scoped>
.page-header {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.64), rgba(0, 0, 0, 0.64)),
    url('@/assets/img/background/bg-news.webp');
  background-size: cover;
}

.page-content {
  .title {
    font-family: $vietnam-font-2;
    margin: 10px 0;
    font-size: 20px;
  }
  .summary {
    color: $color-gray-8;
  }
  .category {
    color: $color-primary;
  }
  .date {
    padding-top: 10px;
    color: $color-gray-7;
  }
}
</style>
