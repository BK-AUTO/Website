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
          <a-form
            :model="formState"
            name="contact-form"
            class="contact-form"
            layout="vertical"
            @finish="handleCreateContact"
          >
            <a-form-item
              class="form-item"
              :label="t('contact.name')"
              name="username"
              :rules="[{ required: true, message: t('error.required2') }]"
            >
              <a-input v-model:value="formState.username" :placeholder="t('contact.enterName')" />
            </a-form-item>

            <a-form-item
              :label="t('contact.phone')"
              name="phone"
              :rules="[{ required: true, message: t('error.required2') }]"
            >
              <a-input v-model:value="formState.phone" :placeholder="t('contact.enterPhone')" />
            </a-form-item>

            <a-form-item :label="t('contact.email')" name="email">
              <a-input v-model:value="formState.email" :placeholder="t('contact.enterEmail')" />
            </a-form-item>

            <a-form-item :label="t('contact.address')" name="address">
              <a-input v-model:value="formState.address" :placeholder="t('contact.enterAddress')" />
            </a-form-item>

            <a-form-item
              :label="t('contact.message')"
              name="message"
              :rules="[{ required: true, message: t('error.required2') }]"
            >
              <a-textarea
                :rows="4"
                v-model:value="formState.message"
                :placeholder="t('contact.enterMessage')"
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
import { useTitle } from '@/composables/common.js';
import ContactService from '@/services/ContactService';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

useTitle('menu.contact');
const { t } = useI18n();
const isLoading = ref(false);

const formState = reactive({
  username: '',
  phone: '',
  email: '',
  address: '',
  message: '',
});

const handleCreateContact = async () => {
  try {
    const data = {
      name: formState.username,
      phone: formState.phone,
      email: formState.email,
      address: formState.address,
      message: formState.message,
    };
    await ContactService.createContact(data);

    alert(t('contact.contactSaved'));
  } catch (error) {
    alert('Có lỗi xảy ra');
  }
};
</script>

<style lang="scss" scoped>
.page-header {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.64), rgba(0, 0, 0, 0.64)),
    url('@/assets/img/background/bg-contact.jpg');
  background-size: cover;
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
