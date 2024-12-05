<template>
  <div>
    <Loading :is-loading="isLoading" />
    <PageHeader :subLinks="['Trang chủ']" mainLink="Liên hệ" title="Quản lý Liên hệ" />
    <div class="page-content">
      <div class="row">
        <div class="col-12 mb-3">
          <a-table :dataSource="contactData" :columns="contactColumns">
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'index'">
                <span> {{ contactData?.length - index }} </span>
              </template>
              <template v-if="column.key === 'publishDate'">
                <span> {{ formatDateString(record?.publishDate) }} </span>
              </template>
              <template v-if="column.key === 'deleteAction'">
                <a-popconfirm
                  title="Bạn có chắc chắn muốn xóa?"
                  ok-text="Có"
                  cancel-text="Không"
                  @confirm="handleDeleteContact(record.id)"
                >
                  <a-button danger> Xóa </a-button>
                </a-popconfirm>
              </template>
            </template>
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Loading from '@/components/Loading.vue';
import PageHeader from '@/components/PageHeader.vue';
import { formatDateString, useTitle } from '@/composables/common.js';
import { onMounted, ref } from 'vue';
import ContactService from '@/services/ContactService';

useTitle('menu.dashboard');
const isLoading = ref(false);

const contactData = ref([]);

onMounted(() => {
  getContacts();
});

const getContacts = async () => {
  try {
    const response = await ContactService.getAllContacts();
    contactData.value = response;
  } catch (error) {
    console.error('Error getting contact:', error);
  }
};

const handleDeleteContact = async (id) => {
  try {
    await ContactService.deleteContact(id);
    alert('Xóa liên hệ thành công');
    getContacts();
  } catch (error) {
    alert('Có lỗi xảy ra');
  }
};

const contactColumns = [
  {
    title: 'STT',
    key: 'index',
  },
  {
    title: 'Ngày đăng',
    dataIndex: 'publishDate',
    key: 'publishDate',
  },
  {
    title: 'Họ tên',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Lời nhắn',
    dataIndex: 'message',
    key: 'message',
    width: '25%',
  },
  {
    title: 'Xóa',
    key: 'deleteAction',
  },
];
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
