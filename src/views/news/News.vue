<template>
  <div>
    <Loading :is-loading="isLoading" />
    <PageHeader
      :subLinks="[t('menu.dashboard')]"
      :mainLink="t('menu.news')"
      :title="t('menu.news')"
    />
    <div class="page-content">
      <div class="row" v-if="newsList.length > 0">
        <div class="col-12">
          <NewsCardV2
            :main="true"
            :id="newsList[0].id"
            :thumbnail="newsList[0].thumbnail"
            :title="newsList[0].title"
            :category="newsList[0].topic"
            :summary="newsList[0].summary"
            :date="newsList[0].publishDate"
          />
        </div>
        <div
          class="col-12"
          v-for="(news, index) in newsList.slice(1, showFullNews ? newsList.length : 5)"
          :key="index"
        >
          <NewsCardV2
            :id="news.id"
            :thumbnail="news.thumbnail"
            :title="news.title"
            :category="news.topic"
            :date="news.publishDate"
            :summary="news.summary"
          />
        </div>
        <div class="col-12 text-end">
          <div class="-more" @click="toggleNews">
            <span v-if="!showFullNews">
              {{ t('common.viewAll') }} <font-awesome-icon :icon="['fas', 'arrow-right']" />
            </span>
            <span v-else>
              <font-awesome-icon :icon="['fas', 'arrow-left']" /> {{ t('common.collapse') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Loading from '@/components/Loading.vue';
import PageHeader from '@/components/PageHeader.vue';
import NewsCardV2 from '@/components/NewsCardV2.vue';
import { useTitle } from '@/composables/common.js';
import NewsService from '@/services/NewsService';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

useTitle('menu.news');
const { t } = useI18n();
const isLoading = ref(false);

const newsList = ref([]);

const showFullNews = ref(false);
const toggleNews = () => (showFullNews.value = !showFullNews.value);

onMounted(() => {
  getNewsList();
});

const getNewsList = async () => {
  try {
    const response = await NewsService.getAllNews();
    newsList.value = response;
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
  * {
    font-family: $inter-font;
  }
}

.-more {
  color: $color-primary;
  cursor: pointer;
}
</style>
