<template>
  <div class="page-content">
    <div class="milestone-subtitle">
      {{ t('milestones.subtitle') }}
      <svg width="100" height="2" viewBox="0 0 60 2">
        <rect y="0.5" width="70" height="1" fill="#888a95" fill-opacity="0.8" />
      </svg>
    </div>
    <div class="milestone-title">{{ t('milestones.title') }}</div>
    <div class="row">
      <div v-for="(milestone, index) in milestones_data" :key="index" :class="columnClass">
        <div class="container">
          <div class="-left">{{ milestone.year }}</div>
          <div class="-right">
            <div :class="titleClass">{{ milestone.title }}</div>
            <div>{{ milestone.rank }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useWindowSize } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import milestones_data from '/src/assets/data/milestones.json';

const { t } = useI18n();
const { width } = useWindowSize();
const columnClass = 'milestone col-12 col-lg-6';
const titleClass = computed(() => (width.value <= 768 ? 'title' : 'title desktop'));
</script>

<style lang="scss" scoped>
.milestone-title {
  font-family: $vietnam-font-2;
  font-size: 28px;
  color: #181c32;
  margin-bottom: 10px;
}
.milestone-subtitle {
  color: $color-gray-7;
  display: flex;
  align-items: center;
  font-size: 12px;
}
.container {
  display: flex;
  padding-block: 20px;
  padding-inline: 0;
  .-left {
    min-width: 48px;
  }
  .-right {
    padding-left: 15px;
    border-left: 2px solid #181c32;
    text-overflow: ellipsis;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .title {
      font-family: $vietnam-font-2;
      color: #181c32;
      font-size: 15.5px;
      font-weight: 700;
      max-width: 100%;
      margin-bottom: 10px;
      &.desktop {
        display: inline-block;
        overflow: none;
        text-wrap: wrap;
        text-overflow: ellipsis;
      }
    }
  }
}
@media (max-width: 768px) {
  .milestone-title {
    font-size: 25px;
  }
}
</style>
