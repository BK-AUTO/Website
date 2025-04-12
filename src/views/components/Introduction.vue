<template>
  <div class="row page-content">
    <div :class="columnClass">
      <div class="subtitle">
        {{ t('intro.subtitle') }}
        <svg width="100" height="2" viewBox="0 0 60 2">
          <rect y="0.5" width="70" height="1" fill="#888a95" fill-opacity="0.8" />
        </svg>
      </div>
      <div class="title">{{ t('intro.title') }}</div>
      <p class="description">
        {{ t('intro.description1') }}
      </p>
      <p class="description">
        {{ t('intro.description2-short') }}
      </p>
      <a-button type="primary">
        <span>{{ t('common.viewAll') }}</span>
        <ArrowRightOutlined />
      </a-button>
    </div>
    <div :class="columnClass">
      <iframe
        width="100%"
        height="300px"
        src="https://www.youtube.com/embed/lR8vXIP2e9I"
        title="[BK-AUTO] Nhiệt huyết và đam mê"
        loading="lazy"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { ArrowRightOutlined } from '@ant-design/icons-vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const columnClass = 'col-12 col-md-6';
</script>

<style lang="scss" scoped>
.page-content {
  display: flex;
  align-items: center;
}
.subtitle {
  color: $color-gray-7;
  display: flex;
  align-items: center;
  font-size: 12px;
}
.title {
  font-family: $vietnam-font-2;
  font-size: 28px;
  color: #181c32;
  margin-bottom: 10px;
}
.description {
  color: $color-gray-7;
  line-height: 1.5;
}
</style>
