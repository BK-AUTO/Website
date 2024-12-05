<template>
  <div class="header-container">
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
          />
        </div>
        <div class="options">
          <a-flex justify="space-between" align="center">
            <LanguageSelect />
            <!-- <div>
              <span>
                <b>{{ username }}</b>
              </span>
            </div>
            <div>
              <a href="#" title="Logout" @click="submitLogout">
                <img src="@/assets/img/svg/log-out.svg" alt="Logout" />
              </a>
            </div> -->
          </a-flex>
        </div>
      </a-flex>
      <a-flex class="header-content" vertical>
        <a-breadcrumb class="screen-path" separator=">">
          <a-breadcrumb-item href="">
            <home-outlined />
          </a-breadcrumb-item>
          <a-breadcrumb-item v-if="currentNode">{{ $t(currentNode) }}</a-breadcrumb-item>
        </a-breadcrumb>
        <h2 v-if="currentNode" class="page-title">{{ $t(currentNode) }}</h2>
      </a-flex>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import LanguageSelect from '@/components/LanguageSelect.vue';
import LoginService from '@/services/LoginService.js';
import { useLanguageStore } from '@/stores/language.js';
import { HomeOutlined } from '@ant-design/icons-vue';
import { useAuthenticationStore } from '@/stores/authentication.js';

const props = defineProps({
  menus: Array,
});

const router = useRouter();
const languageStore = useLanguageStore();
const authenticationStore = useAuthenticationStore();

const current = ref(['']);
const selectedLang = ref(null);
const username = authenticationStore.user || '';

const currentNode = computed(() => {
  return router.currentRoute.value.name;
});

const i18n = useI18n();

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

const submitLogout = async () => {
  try {
    await LoginService.logout();
  } catch (error) {
    alert(error);
  }
};
</script>

<style lang="scss" scoped>
.header-container {
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
    ul.ant-menu-overflow {
      background: transparent;
    }

    h2.page-title {
      margin-top: 8px;
      font-size: 1.5rem;
      font-weight: 600;
      color: $color-green-base;
    }

    .screen-path {
      margin-top: 1rem;
    }
  }
}
</style>
