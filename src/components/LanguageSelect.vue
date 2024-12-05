<template>
  <div>
    <a-dropdown>
      <a @click.prevent>
        <img
          v-if="selectedLanguage == LANG_VN"
          src="../assets/img/flags/vi.svg"
          alt="flag"
          class="flag-icon"
        />
        <img
          v-if="selectedLanguage == LANG_EN"
          src="../assets/img/flags/en.svg"
          alt="flag"
          class="flag-icon"
        />
        <span class="down-icon">
          <DownOutlined style="font-size: 12px" />
        </span>
      </a>
      <template #overlay>
        <a-menu>
          <a-menu-item>
            <a @click="handleChange(LANG_VN)">Tiếng Việt</a>
          </a-menu-item>
          <a-menu-item>
            <a @click="handleChange(LANG_EN)">English</a>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLanguageStore } from '@/stores/language';
import { setI18nLanguage } from '@/i18n.js';
import { DownOutlined } from '@ant-design/icons-vue';
import { LANG_EN, LANG_VN } from '@/composables/constants';

const { locale } = useI18n();
const languageStore = useLanguageStore();

const selectedLanguage = computed(() => languageStore.currentLocale);

const handleChange = (item) => {
  locale.value = item;
  languageStore.setLocale(item);
  setI18nLanguage(item);
};
</script>

<style lang="scss" scoped>
.flag-icon {
  height: 22px;
  margin-right: 8px;
}
.down-icon {
  color: #fff !important;
}
</style>
