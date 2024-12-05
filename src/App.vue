<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#3ac569',
      },
    }"
  >
    <router-view v-slot="{ Component }">
      <component :is="Component"></component>
    </router-view>
  </a-config-provider>
</template>

<script setup>
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';
import { loadCurrentLanguage } from '@/composables/language.js';
import { useI18n } from 'vue-i18n';
import { setI18nLanguage } from '@/i18n.js';
import '@/assets/scss/app.scss';
import 'ant-design-vue/dist/reset.css';

const { locale } = useI18n();

onMounted(() => {
  const lang = loadCurrentLanguage();
  locale.value = lang;
  setI18nLanguage(lang);
});
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;700&display=swap');

* {
  font-family: 'Inter', 'Rubik', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
