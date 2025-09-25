<template>
  <div class="member-recruitment">
    <Loading :is-loading="isLoading" />
    
    <!-- Use standard PageHeader like other pages -->
    <PageHeader
      :subLinks="[t('menu.dashboard')]"
      :mainLink="t('menu.memberRecruitment')"
      :title="t('recruitment.title')"
    />

    <!-- Main Content -->
    <div class="page-content">
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-8">
            
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
      questions: formData.questions || ''
    });

    const response = await fetch(`https://script.google.com/macros/s/AKfycbyxoauUdPbcCd5jOhSbKi5CWbF9rvLDBx7vHXmkdyJi6ixIEplBtKLj0WU1MCUWK4ea9g/exec?${params.toString()}`);
    
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

.page-header {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.64), rgba(0, 0, 0, 0.64)),
              url('@/assets/img/background/clb.jpg') center/cover;
}

.page-content {
  padding: 40px 0;
  background: $color-gray-2;
  min-height: calc(100vh - 480px);
}

.info-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 48px;
  margin-bottom: 40px;
  
  @media (max-width: $md) {
    padding: 36px;
    margin-bottom: 32px;
  }
  
  @media (max-width: $sm) {
    padding: 28px;
    margin-bottom: 24px;
  }
}

.form-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 48px;
  
  @media (max-width: $md) {
    padding: 36px;
  }
  
  @media (max-width: $sm) {
    padding: 28px;
  }
}

.form-title {
  font-family: $vietnam-font-2;
  font-size: 28px;
  color: #181c32;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: $md) {
    font-size: 24px;
    margin-bottom: 24px;
  }
  
  @media (max-width: $sm) {
    font-size: 20px;
    gap: 8px;
  }
  
  i {
    color: $color-primary;
    font-size: 32px;
    
    @media (max-width: $md) {
      font-size: 28px;
    }
    
    @media (max-width: $sm) {
      font-size: 24px;
    }
  }
}

.info-section {
  margin-bottom: 40px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: $sm) {
    margin-bottom: 32px;
  }
}

.section-title {
  font-family: $vietnam-font-2;
  font-size: 26px;
  color: #181c32;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: $md) {
    font-size: 22px;
    margin-bottom: 20px;
    gap: 10px;
  }
  
  @media (max-width: $sm) {
    font-size: 20px;
    gap: 8px;
  }
  
  i {
    color: $color-primary;
    font-size: 28px;
    
    @media (max-width: $md) {
      font-size: 24px;
    }
    
    @media (max-width: $sm) {
      font-size: 22px;
    }
  }
}

.timeline-items {
  display: flex;
  flex-direction: column;
  gap: 28px;
  
  @media (max-width: $sm) {
    gap: 24px;
  }
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  
  @media (max-width: $sm) {
    gap: 12px;
  }
}

.timeline-badge {
  background: $color-primary;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: $fw-bold;
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 2px;
  
  @media (max-width: $sm) {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
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
  gap: 16px;
  margin-bottom: 20px;
  padding: 20px;
  background: $color-gray-3;
  border-radius: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  i {
    color: $color-warning;
    margin-top: 2px;
    font-size: 18px;
  }
  
  span {
    color: $color-gray-8;
    line-height: 1.6;
    font-size: 15px;
  }
}

.contact-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  
  i {
    color: $color-primary;
    font-size: 18px;
    width: 24px;
    text-align: center;
  }
  
  span {
    color: $color-gray-7;
    font-size: 15px;
    line-height: 1.5;
    
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

@media (max-width: $lg) {
  .page-content {
    padding: 32px 0;
  }
}

@media (max-width: $md) {
  .page-content {
    padding: 24px 0;
  }
  
  .timeline-content {
    strong {
      font-size: 15px;
    }
    
    p {
      font-size: 13px;
    }
  }
}

@media (max-width: $sm) {
  .page-content {
    padding: 20px 0;
  }
  
  .note-item {
    padding: 12px;
    gap: 10px;
    
    i {
      font-size: 14px;
    }
    
    span {
      font-size: 14px;
    }
  }
  
  .contact-item {
    gap: 10px;
    
    i {
      font-size: 14px;
    }
    
    span {
      font-size: 14px;
    }
  }
}

@media (max-width: $xs) {
  .container-fluid {
    padding-left: 12px;
    padding-right: 12px;
  }
  
  .timeline-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .timeline-badge {
    align-self: flex-start;
  }
}
</style>