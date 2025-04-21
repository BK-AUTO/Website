<template>
  <div>
    <Loading :is-loading="isLoading" />
    <PageHeader
      :subLinks="[t('menu.dashboard'), t('menu.project')]"
      :mainLink="formState?.title"
      :title="t('menu.project')"
    />
    <div class="page-content">
      <div class="row">
        <div class="col-12 mb-3">
          <div class="title">{{ formState.title }}</div>
          <div>
            <span class="date"> {{ formatDateString(formState.publishDate) }}</span>
          </div>
        </div>
        <div class="col-12">
          <QuillEditor
            theme="bubble"
            :toolbar="[]"
            v-model:content="projectContent"
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
import ProjectService from '@/services/ProjectService';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';

const route = useRoute();
const projectId = route.params.id;

useTitle('menu.project');
const { t } = useI18n();
const isLoading = ref(false);

const quill = ref(null);
const projectContent = ref();
const thumbnailUrl = ref(null);
const formState = reactive({
  title: '',
  publishDate: null,
});

onMounted(() => {
  getProject();
});

const getProject = async () => {
  try {
    const response = await ProjectService.getProjectById(projectId);
    if (response.thumbnail) {
      thumbnailUrl.value = `data:image/jpeg;base64,${response.thumbnail}`;
    }
    if (response.content) {
      const data = JSON.parse(response.content);
      quill.value.setContents(data.ops);
    }
    formState.title = response.title;
    formState.publishDate = response.publishDate;
  } catch (error) {
    console.error('Error getting project:', error);
  }
};
</script>

<style lang="scss" scoped>
.page-header {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.64), rgba(0, 0, 0, 0.64)),
    url('@/assets/img/background/bg-project.webp');
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
