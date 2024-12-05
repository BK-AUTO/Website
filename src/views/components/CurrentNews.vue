<template>
  <div class="row page-content" :wrap="true">
    <div class="content-header">
      <div class="-left">
        <div class="courses-subtitle">
          {{ t('news.subtitle') }}
          <svg width="100" height="2" viewBox="0 0 60 2">
            <rect y="0.5" width="70" height="1" fill="#888a95" fill-opacity="0.8" />
          </svg>
        </div>
        <div class="courses-title">{{ t('news.title') }}</div>
      </div>
      <div class="-right">
        <div class="-more" @click="toggleNews">
          <span> {{ t('common.viewAll') }} <font-awesome-icon :icon="['fas', 'arrow-right']" /> </span>
        </div>
      </div>
    </div>
    <div class="row top-news">
      <div class="col-12 col-lg-6 mb-4 mb-lg-0">
        <NewsCard
          v-if="newsList.length > 0"
          :main="true"
          :id="newsList[0].id"
          :thumbnail="newsList[0].thumbnail"
          :title="newsList[0].title"
          :category="newsList[0].topic"
          :summary="newsList[0].summary"
          :date="newsList[0].publishDate"
        />
      </div>
      <div class="col-12 col-lg-6">
        <div class="row g-4">
          <div class="col-6" v-for="(news, index) in newsList.slice(1, 5)" :key="index">
            <NewsCard
              :id="news.id"
              :thumbnail="news.thumbnail"
              :title="news.title"
              :category="news.topic"
              :date="news.publishDate"
              :summary="news.summary"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import NewsCard from '@/components/NewsCard.vue';
import NewsService from '@/services/NewsService';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const router = useRouter();

const newsList = ref([]);

const toggleNews = () => {
  router.push('/news');
};

onMounted(() => {
  getNewsList();
});

const getNewsList = async () => {
  try {
    const response = await NewsService.getTopNews();
    newsList.value = response;
  } catch (error) {
    console.error('Error getting news:', error);
  }
};
</script>
<style lang="scss" scoped>
.content-header {
  display: flex;
  justify-content: space-between;
  .-right {
    .-more {
      color: $color-primary;
      cursor: pointer;
    }
  }
}

.courses-title {
  font-family: $vietnam-font-2;
  font-size: 28px;
  color: #181c32;
  margin-bottom: 10px;
}
.courses-subtitle {
  color: $color-gray-7;
  font-size: 12px;
  margin-bottom: 20px;
}
</style>
