<template>
  <Loading :is-loading="isLoading" />
  <a-flex class="login-container">
    <div class="login-card">
      <a-flex vertical class="logo-container">
        <img class="logo" src="@/assets/img/bkauto-logo.svg" alt="Logo" />
        <span class="title">BK-Auto</span>
      </a-flex>
      <a-flex vertical class="login-form">
        <a-form
          ref="formRef"
          layout="vertical"
          :model="formState"
          :rules="rules"
          @finish="submitLogin"
        >
          <a-form-item name="username">
            <a-input
              v-model:value="formState.username"
              autocomplete="off"
              :placeholder="t('common.username')"
            >
              <template #addonBefore>
                <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item name="password">
            <a-input
              v-model:value="formState.password"
              type="password"
              autocomplete="off"
              :placeholder="t('common.password')"
            >
              <template #addonBefore>
                <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
              </template>
            </a-input>
          </a-form-item>
          <div class="language-select">
            <LanguageSelect />
          </div>
          <a-form-item>
            <a-button class="login-btn" type="primary" html-type="submit">
              {{ t('common.login') }}
            </a-button>
          </a-form-item>
        </a-form>
      </a-flex>
    </div>
  </a-flex>
</template>

<script setup>
import LanguageSelect from '@/components/LanguageSelect.vue';
import Loading from '@/components/Loading.vue';
import { showNotificationError, useTitle } from '@/composables/common.js';
import { PASSWORD_REGEX } from '@/composables/constants.js';
import { navigateToHomepage, navigateToManagement } from '@/composables/navigation.js';
import LoginService from '@/services/LoginService.js';
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

useTitle('common.login');
const { t } = useI18n();

const formRef = ref();
const isShowModalConfirm = ref(false);
const isLoading = ref(false);

const formState = reactive({
  username: '',
  password: '',
});
const submitLogin = async (value) => {
  try {
    isLoading.value = true;
    const payload = {
      username: value.username,
      password: value.password,
    };

    const responseData = await LoginService.login(payload);

    navigateToManagement();
  } catch (error) {
    if (error.response && error.response.status === 400) {
      showNotificationError(t, t('error.loginUnsuccessful'));
    } else {
      showNotificationError(t, error);
    }
  } finally {
    isLoading.value = false;
  }
};

const handleConfirm = () => {
  isShowModalConfirm.value = false;
  navigateToHomepage();
};

const checkPassword = async (_rule, value) => {
  if (value === '') {
    return Promise.reject(t('error.required', ['password']));
  } else if (!PASSWORD_REGEX.test(value)) {
    return Promise.reject(t('error.password'));
  }
  return Promise.resolve();
};

const rules = {
  username: [
    {
      required: true,
      trigger: 'change',
      message: t('error.required', ['username']),
    },
  ],
  password: [
    {
      required: true,
      validator: checkPassword,
      trigger: 'change',
    },
  ],
};
const resetForm = () => {
  formRef.value.resetFields();
};

onMounted(() => {
  resetForm();
});
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  justify-content: center;
  align-items: center;

  .login-card {
    width: 380px;
    padding: 2rem 3rem 1.2rem 3rem;
    background-color: $color-gray-1;
    border-radius: 8px;
    box-shadow:
      rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
      rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,
      rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;

    animation: slideAndFadeIn ease-in-out 0.5s;
    transform-origin: top;

    .logo-container {
      text-align: center;

      .logo {
        width: 180px;
        margin: 0 auto;
      }

      .title {
        margin-top: 0.25rem;
        font-size: 1.25rem;
        font-weight: 500;
        color: $color-gray-7;
      }
    }

    .login-form {
      margin-top: 1.5rem;
      justify-content: center;

      .ant-form-item {
        margin-bottom: 0.8rem;
      }

      .language-select {
        display: flex;
        flex-direction: row-reverse;
      }

      .login-btn {
        margin-top: 1rem;
        height: 44px;
        width: 100%;
        text-transform: uppercase;
        font-size: 1rem;
        letter-spacing: 2px;
      }
    }
  }
}
</style>
