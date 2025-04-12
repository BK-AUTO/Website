<template>
  <div>
    <Loading :is-loading="isLoading" />
    <PageHeader
      :subLinks="[t('menu.dashboard')]"
      :mainLink="t('menu.research')"
      :title="t('menu.research')"
    />

    <div class="col-12">
      <OurProjects :expandable="true" class="pb-0" />
    </div>
    <div class="col-12">
      <OurResearch :expandable="true" />
    </div>
  </div>
</template>

<script setup>
import Loading from '@/components/Loading.vue';
import PageHeader from '@/components/PageHeader.vue';
import { useTitle } from '@/composables/common.js';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import OurProjects from '../components/OurProjects.vue';
import OurResearch from '../components/OurResearch.vue';

useTitle('menu.research');
const { t } = useI18n();
const isLoading = ref(false);
</script>

<style lang="scss" scoped>
.page-header {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.64), rgba(0, 0, 0, 0.64)),
    url('@/assets/img/background/bg-research.webp');
  background-size: cover;
}
</style>
