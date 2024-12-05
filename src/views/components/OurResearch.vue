<template>
  <div class="row page-content" :wrap="true">
    <div class="content-header">
      <div class="-left">
        <div class="researchs-subtitle">
          {{ t('research.subtitle') }}
          <svg width="100" height="2" viewBox="0 0 60 2">
            <rect y="0.5" width="70" height="1" fill="#888a95" fill-opacity="0.8" />
          </svg>
        </div>
        <div class="researchs-title">{{ t('research.title') }}</div>
      </div>
    </div>
    <div
      class="profile col-12 col-md-6 col-lg-4"
      v-for="(research, index) in researchList.slice(
        0,
        showFullResearchs ? researchList.length : 6,
      )"
      :key="index"
    >
      <ResearchCard
        :id="research.id"
        :thumbnail="research.thumbnail"
        :title="research.title"
        :variant="index % 2"
      />
    </div>
    <div class="content-header">
      <div class="-left"></div>
      <div v-if="expandable" class="-right">
        <div class="-more" @click="toggleResearchs">
          <span v-if="!showFullResearchs">
            {{ t('common.viewAll') }} <font-awesome-icon :icon="['fas', 'arrow-right']" />
          </span>
          <span v-else
            ><font-awesome-icon :icon="['fas', 'arrow-left']" /> {{ t('common.collapse') }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import ResearchCard from '@/components/ResearchCard.vue';
import ResearchService from '@/services/ResearchService';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps({
  expandable: Boolean,
});

const showFullResearchs = ref(false);
const toggleResearchs = () => (showFullResearchs.value = !showFullResearchs.value);
const researchList = ref([]);

onMounted(() => {
  getResearchList();
});

const getResearchList = async () => {
  try {
    const response = await ResearchService.getAllResearch();
    researchList.value = response;
  } catch (error) {
    console.error('Error getting research:', error);
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
      font-weight: 500;
      cursor: pointer;
    }
  }
}

.researchs-title {
  font-family: $vietnam-font-2;
  font-size: 28px;
  color: #181c32;
  margin-bottom: 10px;
}
.researchs-subtitle {
  color: $color-gray-7;
  font-size: 12px;
  margin-bottom: 16px;
}
</style>
