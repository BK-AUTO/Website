<template>
  <div>
    <Loading :is-loading="isLoading" />
    <PageHeader
      :subLinks="[t('menu.dashboard')]"
      :mainLink="t('menu.contact')"
      :title="t('menu.contact')"
    />
    <div class="page-content">
      <div class="row">
        <div class="col-0 col-lg-5 contact-img"></div>
        <div class="col-0 col-lg-1"></div>
        <div class="col-12 col-lg-6 contact-box">
          <p class="contact-title">{{ t('contact.title') }}</p>
          <p class="contact-subtitle">{{ t('contact.subtitle') }}</p>
          <div class="privacy-notice">
            {{ t('contact.privacyNotice') }}
          </div>
          <a-form
            :model="formState"
            name="contact-form"
            class="contact-form"
            layout="vertical"
            @finish="handleCreateContact"
            @finishFailed="onFinishFailed"
          >
            <input type="hidden" :value="csrfToken" name="_csrf" />
            <a-form-item
              class="form-item"
              :label="t('contact.name')"
              name="username"
              :rules="[{ required: true, message: t('error.required2') }]"
            >
              <a-input
                v-model:value="formState.username"
                :placeholder="t('contact.enterName')"
                :maxLength="50"
                @paste.prevent
              />
            </a-form-item>

            <a-form-item
              :label="t('contact.phone')"
              name="phone"
              :rules="[
                { required: true, message: t('error.required2') },
                { pattern: /^[0-9]{10,11}$/, message: t('error.invalidPhone') }
              ]"
            >
              <a-input
                v-model:value="formState.phone"
                :placeholder="t('contact.enterPhone')"
                :maxLength="11"
                @paste.prevent
              />
            </a-form-item>

            <a-form-item
              :label="t('contact.email')"
              name="email"
              :rules="[
                { type: 'email', message: t('error.invalidEmail') },
                { max: 100, message: t('error.maxLength') }
              ]"
            >
              <a-input
                v-model:value="formState.email"
                :placeholder="t('contact.enterEmail')"
                :maxLength="100"
              />
            </a-form-item>

            <a-form-item
              :label="t('contact.address')"
              name="address"
              :rules="[
                { max: 200, message: t('error.maxLength') }
              ]"
            >
              <a-input
                v-model:value="formState.address"
                :placeholder="t('contact.enterAddress')"
                :maxLength="200"
              />
            </a-form-item>

            <a-form-item
              :label="t('contact.message')"
              name="message"
              :rules="[
                { required: true, message: t('error.required2') },
                { max: 1000, message: t('error.maxLength') }
              ]"
            >
              <a-textarea
                :rows="4"
                v-model:value="formState.message"
                :placeholder="t('contact.enterMessage')"
                :maxLength="1000"
              />
            </a-form-item>

            <a-form-item>
              <a-button type="primary" html-type="submit" style="width: 100%">
                {{ t('contact.send') }}
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Loading from '@/components/Loading.vue';
import PageHeader from '@/components/PageHeader.vue';
import { useTitle, showNotificationSuccess, showNotificationError } from '@/composables/common.js';
import ContactService from '@/services/ContactService';
import { reactive, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';

useTitle('menu.contact');
const { t } = useI18n();
const isLoading = ref(false);
const csrfToken = ref('');

// Rate limiting
const RATE_LIMIT_KEY = 'contact_form_submissions';
const RATE_LIMIT_TIME = 5 * 60 * 1000; // 5 minutes
const MAX_SUBMISSIONS = 3;

const checkRateLimit = () => {
  const submissions = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]');
  const now = Date.now();
  
  // Remove old submissions
  const recentSubmissions = submissions.filter(time => now - time < RATE_LIMIT_TIME);
  
  if (recentSubmissions.length >= MAX_SUBMISSIONS) {
    return false;
  }
  
  return true;
};

const updateRateLimit = () => {
  const submissions = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]');
  submissions.push(Date.now());
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(submissions));
};

onMounted(async () => {
  try {
    const response = await fetch('/api/csrf-token', {
      credentials: 'include'
    });
    const data = await response.json();
    csrfToken.value = data.token;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
  }
});

const formState = reactive({
  username: '',
  phone: '',
  email: '',
  address: '',
  message: '',
});

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[^a-zA-Z0-9\s@._-]/g, ''); // Allow only alphanumeric and common email chars
};

const handleCreateContact = async () => {
  try {
    if (!csrfToken.value) {
      showNotificationError(t, t('error.securityToken'));
      return;
    }

    if (!checkRateLimit()) {
      showNotificationError(t, t('error.tooManySubmissions'));
      return;
    }

    isLoading.value = true;
    const data = {
      name: sanitizeInput(formState.username),
      phone: sanitizeInput(formState.phone),
      email: sanitizeInput(formState.email),
      address: sanitizeInput(formState.address),
      message: sanitizeInput(formState.message),
      _csrf: csrfToken.value
    };

    await ContactService.createContact(data);
    updateRateLimit();
    showNotificationSuccess(t, t('contact.contactSaved'));
    
    // Clear form after successful submission
    Object.keys(formState).forEach(key => {
      formState[key] = '';
    });
    
  } catch (error) {
    showNotificationError(t, t('error.genericError'));
  } finally {
    isLoading.value = false;
  }
};

const onFinishFailed = ({ values, errorFields, outOfDate }) => {
  showNotificationError(t, t('error.pleaseCheckForm'));
};
</script>

<style lang="scss" scoped>
.page-header {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.64), rgba(0, 0, 0, 0.64)),
    url('@/assets/img/background/bg-contact.webp');
  background-size: cover;
}

.privacy-notice {
  background-color: #f8f9fa;
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 4px;
  font-size: 0.9em;
  color: $color-gray;
  border: 1px solid #e9ecef;
}

.page-content {
  * {
    font-family: $vietnam-font-2;
  }

  .contact-img {
    background: url('@/assets/img/contact/contact1.jpg');
    background-size: cover;
  }

  .contact-title {
    font-size: 32px;
    font-weight: 600;
    font-family: $vietnam-font-2;
    margin-bottom: 6px;
  }

  .contact-subtitle {
    font-size: 14px;
    color: $color-gray;
    margin-bottom: 24px;
  }

  .contact-form {
    .form-item {
      color: red !important;
    }
  }
}
</style>
