<template>
  <div>
    <Loading :is-loading="isLoading" />
    <PageHeader
      :subLinks="[t('menu.dashboard'), t('menu.research')]"
      :mainLink="formState?.title"
      :title="t('menu.research')"
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
            theme="snow"
            :toolbar="[]"
            v-model:content="researchContent"
            @ready="quill = $event"
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
import ResearchService from '@/services/ResearchService';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const route = useRoute();
const researchId = route.params.id;

useTitle('menu.research');
const { t } = useI18n();
const isLoading = ref(false);

const quill = ref(null);
const researchContent = ref();
const thumbnailUrl = ref(null);
const formState = reactive({
  title: '',
  publishDate: null,
});

onMounted(() => {
  getResearch();
});

const getResearch = async () => {
  try {
    const response = await ResearchService.getResearchById(researchId);
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
    console.error('Error getting research:', error);
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
