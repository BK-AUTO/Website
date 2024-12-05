<template>
  <div class="row page-content">
    <div :class="columnClass" class="py-0">
      <div class="event-title">{{ t('event.title') }}</div>
      <div v-for="(event, index) in events_data" :key="index" :class="columnClass">
        <EventBar :date="event.date" :place="event.place" :title="event.title" :time="event.time" />
      </div>
    </div>
    <!-- <div :class="columnClass"></div> -->
  </div>
</template>
<style lang="scss" scoped>
.page-content {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
    url('@/assets/img/background/bg3.jpeg');
  background-position: center;
  background-size: cover;
  .event-title {
    font-size: 32px;
    font-family: $vietnam-font-2;
    color: $color-primary;
    margin-bottom: 12px;
  }
  .stat {
    padding: 30px;
    padding-left: 0;
    padding-right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    .figure {
      font-size: 64px;
      font-family: $vietnam-font-2;
    }
  }
}
</style>

<script setup>
import EventBar from '@/components/EventBar.vue';
import EventPoster from '@/components/EventPoster.vue';
import { useI18n } from 'vue-i18n';
import events_data from '/src/assets/data/events.json';

const { t } = useI18n();
const columnClass = 'stat col-12 col-md-12';
</script>
