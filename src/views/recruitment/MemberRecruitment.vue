<template>
  <div class="member-recruitment">
    <Loading :is-loading="isLoading" />
    
    <!-- Header Navigation -->
    <HeaderV2></HeaderV2>
    
    <!-- Page Header Section -->
    <div class="page-header-section">
      <div class="header-content">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-12">
              <!-- Breadcrumb -->
              <div class="breadcrumb-container">
                <a-breadcrumb separator="">
                  <a-breadcrumb-item
                    v-for="(subLink, index) in [t('menu.dashboard')]"
                    v-bind:key="index"
                    href="/"
                    class="sub-link"
                  >
                    <span>{{ subLink }}</span>
                    <span class="breadcrumb-separator">/</span>
                  </a-breadcrumb-item>

                  <a-breadcrumb-item class="main-link">
                    <span>{{ t('menu.memberRecruitment') }}</span>
                  </a-breadcrumb-item>
                </a-breadcrumb>
              </div>

              <!-- Page Title -->
              <div class="page-title">
                <span>{{ t('recruitment.title') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="page-content">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10">
            
            <!-- Information Card -->
            <div class="info-card">
              <!-- Timeline Section -->
              <div class="info-section">
                <h3 class="section-title">
                  <i class="fas fa-calendar-alt"></i>
                  {{ t('recruitment.timeline.title') }}
                </h3>
                <div class="timeline-items">
                  <div class="timeline-item">
                    <span class="timeline-badge">1</span>
                    <div class="timeline-content">
                      <strong>{{ t('recruitment.timeline.round1') }}</strong>
                      <p>{{ t('recruitment.timeline.round1_detail') }}</p>
                    </div>
                  </div>
                  <div class="timeline-item">
                    <span class="timeline-badge">2</span>
                    <div class="timeline-content">
                      <strong>{{ t('recruitment.timeline.round2') }}</strong>
                      <p>{{ t('recruitment.timeline.round2_detail') }}</p>
                    </div>
                  </div>
                  <div class="timeline-item">
                    <span class="timeline-badge">3</span>
                    <div class="timeline-content">
                      <strong>{{ t('recruitment.timeline.round3') }}</strong>
                      <p>{{ t('recruitment.timeline.round3_detail') }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Target Audience -->
              <div class="info-section">
                <h3 class="section-title">
                  <i class="fas fa-users"></i>
                  {{ t('recruitment.target.title') }}
                </h3>
                <div class="target-audience">
                  <p>{{ t('recruitment.target.description') }}</p>
                </div>
              </div>

              <!-- Important Notes -->
              <div class="info-section">
                <h3 class="section-title">
                  <i class="fas fa-exclamation-circle"></i>
                  {{ t('recruitment.notes.title') }}
                </h3>
                <div class="note-item">
                  <i class="fas fa-info-circle"></i>
                  <span>{{ t('recruitment.notes.note1') }}</span>
                </div>
                <div class="note-item">
                  <i class="fas fa-clock"></i>
                  <span>{{ t('recruitment.notes.note2') }}</span>
                </div>
                <div class="note-item">
                  <i class="fas fa-envelope"></i>
                  <span>{{ t('recruitment.notes.note3') }}</span>
                </div>
              </div>

              <!-- Contact Info -->
              <div class="info-section">
                <h3 class="section-title">
                  <i class="fas fa-phone"></i>
                  {{ t('recruitment.contact.title') }}
                </h3>
                <div class="contact-items">
                  <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>{{ t('recruitment.contact.email') }}: bkauto.ste@gmail.com</span>
                  </div>
                  <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <span>{{ t('recruitment.contact.phone') }}: 0332611486 (Chu Tiến Đạt - Chủ nhiệm)</span>
                  </div>
                  <div class="contact-item">
                    <i class="fab fa-facebook"></i>
                    <span>{{ t('recruitment.contact.fanpage') }}: 
                      <a href="https://www.facebook.com/BKAUTO.STE" target="_blank">https://www.facebook.com/BKAUTO.STE</a>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Registration Form Card -->
            <div class="form-card">
              <h3 class="form-title">
                <i class="fas fa-user-plus"></i>
                {{ t('recruitment.form.title') }}
              </h3>
              <RecruitmentForm @submit="handleFormSubmit" :loading="isSubmitting" />
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <a-modal
      v-model:open="showSuccessModal"
      :title="t('recruitment.success.title')"
      :footer="null"
      :closable="false"
      centered
    >
      <div class="success-content">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h4>{{ t('recruitment.success.message') }}</h4>
        <p>{{ t('recruitment.success.description') }}</p>
        <a-button type="primary" @click="closeSuccessModal" block>
          {{ t('common.close') }}
        </a-button>
      </div>
    </a-modal>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
import PageHeader from '@/components/PageHeader.vue';
import HeaderV2 from '@/layout/AppHeaderV2.vue';
import Loading from '@/components/Loading.vue';
import RecruitmentForm from './components/RecruitmentForm.vue';
import { useTitle } from '@/composables/common.js';

useTitle('menu.memberRecruitment');

const { t } = useI18n();
const router = useRouter();

const isLoading = ref(false);
const isSubmitting = ref(false);
const showSuccessModal = ref(false);

const handleFormSubmit = async (formData) => {
  isSubmitting.value = true;
  isLoading.value = true;

  try {
    // Submit to Google Apps Script
    const params = new URLSearchParams({
      timestamp: new Date().toLocaleString(),
      fullName: formData.fullName,
      identifier: formData.identifier, // MSSV or School
      majorClass: formData.majorClass, // Major/Class or Major
      email: formData.email,
      phone: formData.phone,
      studentType: formData.studentType, // 'hust' or 'external'
      mainDepartment: formData.mainDepartment,
      subDepartments: JSON.stringify(formData.subDepartments),
      cvLink: formData.cvLink,
      resendApiKey: 're_8qQ8DT8z_3KopiBrxRTDymkLUNijJM2pi'
    });

    const response = await fetch(`https://script.google.com/macros/s/AKfycbzIQrn7Lv2tiu3Qj-yxphfHnT1ojxvvQnLnSt2lXFSAC3fiyzw2FbHT5wFWU49-K3U2Kg/exec?${params.toString()}`);
    
    const result = await response.text();
    
    if (response.ok) {
      showSuccessModal.value = true;
      message.success(t('recruitment.form.submitSuccess'));
    } else {
      throw new Error(result);
    }
  } catch (error) {
    console.error('Submit error:', error);
    message.error(t('recruitment.form.submitError'));
  } finally {
    isSubmitting.value = false;
    isLoading.value = false;
  }
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
  router.push('/dashboard');
};
</script>

<style lang="scss" scoped>
.member-recruitment {
  min-height: 100vh;
}

.page-header-section {
  height: 480px;
  background: url('@/assets/img/background/clb.jpg') center/cover;
  position: relative;
  
  .header-content {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 100%;
    padding: 0 20px 40px;
    
    .breadcrumb-container {
      margin-bottom: 20px;
      text-align: center;
      
      .ant-breadcrumb {
        display: flex;
        justify-content: center;
        
        .sub-link {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          
          &:hover {
            color: white;
          }
        }
        
        .main-link {
          color: white;
          font-weight: 500;
        }
        
        .breadcrumb-separator {
          margin: 0 8px;
          color: rgba(255, 255, 255, 0.6);
        }
      }
    }
    
    .page-title {
      text-align: center;
      
      span {
        font-size: 2.5rem;
        font-weight: bold;
        color: white;
        text-shadow: 0 2px 4px rgba(255, 254, 254, 0.3);
        line-height: 1.2;
        display: block;
      }
    }
  }
}

.page-header {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.64), rgba(0, 0, 0, 0.64)),
              url('@/assets/img/background/bg-default.webp') center/cover;
}

.page-content {
  padding: 60px 0;
  background: $color-gray-2;
  min-height: calc(100vh - 480px);
}

.info-card {
  background: white;
  border-radius: 8px;
  box-shadow: $shadow-1;
  padding: 40px;
  margin-bottom: 40px;
}

.form-card {
  background: white;
  border-radius: 8px;
  box-shadow: $shadow-1;
  padding: 40px;
}

.form-title {
  font-family: $vietnam-font-2;
  font-size: 24px;
  color: #181c32;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  i {
    color: $color-primary;
    font-size: 28px;
  }
}

.info-section {
  margin-bottom: 40px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  font-family: $vietnam-font-2;
  font-size: 20px;
  color: #181c32;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  
  i {
    color: $color-primary;
    font-size: 22px;
  }
}

.timeline-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.timeline-badge {
  background: $color-primary;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: $fw-bold;
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 2px;
}

.timeline-content {
  flex: 1;
  
  strong {
    display: block;
    color: #181c32;
    font-size: 16px;
    font-weight: $fw-semibold;
    margin-bottom: 5px;
  }
  
  p {
    margin: 0;
    color: $color-gray-7;
    font-size: 14px;
    line-height: 1.5;
  }
}

.target-audience {
  background: $color-gray-3;
  padding: 20px;
  border-radius: 8px;
  margin-top: 30px;
  
  h4 {
    color: #181c32;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: $fw-semibold;
    display: flex;
    align-items: center;
    gap: 8px;
    
    i {
      color: $color-primary;
    }
  }
  
  p {
    margin: 0;
    color: $color-gray-7;
    line-height: 1.5;
  }
}

.note-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 15px;
  padding: 15px;
  background: $color-gray-3;
  border-radius: 6px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  i {
    color: $color-warning;
    margin-top: 2px;
    font-size: 16px;
  }
  
  span {
    color: $color-gray-8;
    line-height: 1.5;
  }
}

.contact-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  
  i {
    color: $color-primary;
    font-size: 16px;
    width: 20px;
    text-align: center;
  }
  
  span {
    color: $color-gray-7;
    
    a {
      color: $color-primary;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.success-content {
  text-align: center;
  padding: 20px;
}

.success-icon {
  font-size: 60px;
  color: $color-success;
  margin-bottom: 20px;
}

.success-content h4 {
  color: $color-success;
  margin-bottom: 15px;
  font-family: $vietnam-font-2;
}

.success-content p {
  color: $color-gray-7;
  margin-bottom: 30px;
  line-height: 1.5;
}

@media (max-width: $md) {
  .page-header-section {
    height: 350px;
    
    .header-content {
      padding: 0 15px 30px;
      
      .page-title span {
        font-size: 1.8rem;
      }
    }
  }
  
  .page-content {
    padding: 30px 0;
  }
  
  .info-card,
  .form-card {
    padding: 24px;
    margin-bottom: 24px;
  }
  
  .timeline-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .timeline-badge {
    align-self: flex-start;
  }
}

@media (max-width: $sm) {
  .page-header-section {
    height: 300px;
    
    .header-content {
      padding: 0 15px 20px;
      
      .page-title span {
        font-size: 1.5rem;
      }
    }
  }
  
  .info-card,
  .form-card {
    padding: 20px;
    margin-bottom: 20px;
  }
}
</style>