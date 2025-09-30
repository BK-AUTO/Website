<template>
  <div class="highlight-stats page-content">
    <div class="row">
      <div :class="columnClass">
        <div class="figure">4+</div>
        <div class="meaning">{{ t('stats.partners') }}</div>
      </div>
      <div :class="columnClass">
        <div class="figure">10+</div>
        <div class="meaning">{{ t('stats.prizes') }}</div>
      </div>
      <div :class="columnClass">
        <div class="figure">100+</div>
        <div class="meaning">{{ t('stats.members') }}</div>
      </div>
      <div :class="columnClass">
        <div class="figure">6</div>
        <div class="meaning">{{ t('stats.courses') }}</div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.highlight-stats {
  background-color: $color-primary;
  .stat {
    padding: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    .figure {
      font-size: 64px;
      font-family: $vietnam-font;
    }
  }
}
</style>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const columnClass = 'stat col-6 col-md-3';
</script>
