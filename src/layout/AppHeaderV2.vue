<template>
  <div :class="headerClass">
    <div class="header-section">
      <a-flex class="header-nav" justify="space-between" align="center">
        <div class="logo-container">
          <div class="logo" />
        </div>
        <div class="navigation">
          <a-menu
            v-model:selectedKeys="getCurrentKeys"
            mode="horizontal"
            :items="menus"
            @click="redirectPage"
            disabledOverflow="true"
          />
        </div>
        <div class="options">
          <a-flex justify="space-between" align="center">
            <LanguageSelect />
          </a-flex>
        </div>
      </a-flex>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import LanguageSelect from '@/components/LanguageSelect.vue';
import { useLanguageStore } from '@/stores/language.js';
import { useAuthenticationStore } from '@/stores/authentication.js';
import { useI18n } from 'vue-i18n';
import { useWindowSize } from '@vueuse/core';

const { width } = useWindowSize();
const headerClass = computed(() =>
  width.value >= 768 ? 'header-container' : 'header-container mobile',
);

const { t } = useI18n();

const router = useRouter();
const languageStore = useLanguageStore();
const authenticationStore = useAuthenticationStore();

const selectedLang = ref(null);
const username = authenticationStore.user || '';

const currentNode = computed(() => {
  return router.currentRoute.value.name;
});

onMounted(() => {
  selectedLang.value = languageStore.currentLocale;
});

const getCurrentKeys = computed(() => {
  let newCurrent = [];
  newCurrent.push(currentNode.value);
  return newCurrent;
});

const redirectPage = (menu) => {
  router.push(menu.item.to);
};

const menus = computed(() => {
  return [
    {
      key: 'menu.dashboard',
      label: t('menu.dashboard'),
      title: t('menu.dashboard'),
      to: '/dashboard',
    },
    {
      key: 'menu.about',
      label: t('menu.about'),
      title: t('menu.about'),
      to: '/about-us',
    },
    {
      key: 'menu.research',
      label: t('menu.research'),
      title: t('menu.research'),
      to: '/research',
    },
    {
      key: 'menu.course',
      label: t('menu.course'),
      title: t('menu.course'),
      to: '/course',
    },
    {
      key: 'menu.news',
      label: t('menu.news'),
      title: t('menu.news'),
      to: '/news',
    },
    {
      key: 'member-recruitment',
      label: t('menu.memberRecruitment'),
      title: t('menu.memberRecruitment'),
      to: '/member-recruitment',
      style: {
        background: '#3ac569',
        color: 'white',
        fontWeight: '600',
        borderRadius: '0',
        border: 'none',
        padding: '8px 16px',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }
    },
  ];
});
</script>

<style lang="scss" scoped>
.header-container {
  width: 100%;

  .header-section {
    width: 100%;
    .logo-container {
      .logo {
        width: 150px;
        height: 44px;
        margin: 0.5rem auto;
        background-image: url('@/assets/img/bkauto-logo.svg');
        background-size: contain;
        background-repeat: no-repeat;
      }
    }
    ul.ant-menu {
      background: transparent;
      justify-content: center;
    }
  }

  &.mobile {
    .header-nav {
      display: flex;
      flex-direction: column;
      .options {
        order: 2;
      }
      .navigation {
        order: 3;
      }
      ul.ant-menu {
        li.ant-menu-item {
          padding: 0 !important;
        }
      }
    }
  }
}

:deep(.ant-menu-item[data-menu-id*="member-recruitment"]) {
  color: white !important;
  
  &:hover {
    background: #2d9d4a !important;
    color: white !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(58, 197, 105, 0.4) !important;
  }
  
  &:active {
    transform: translateY(0);
    color: white !important;
    box-shadow: 0 2px 6px rgba(58, 197, 105, 0.6) !important;
  }
  
  .ant-menu-title-content {
    color: white !important;
  }
}
</style>