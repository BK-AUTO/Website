<template>
  <div class="recruitment-form">
    <!-- Already Submitted Notice -->
    <div v-if="submissionStatus" class="submission-complete">
      <div class="success-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <h3 class="success-title">{{ t('recruitment.success.alreadySubmitted') }}</h3>
      <p class="success-message">
        {{ t('recruitment.success.candidateName', { name: submissionStatus.candidateName }) }}
      </p>
      <p class="success-timestamp">
        {{ t('recruitment.success.submittedAt') }}: {{ formatTimestamp(submissionStatus.timestamp) }}
      </p>
      <div class="success-actions">
      </div>
    </div>

    <!-- Form Content (only show if not submitted) -->
    <div v-else>
    <a-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      layout="vertical"
      @finish="handleSubmit"
    >
      
      <!-- Student Type Selection -->
      <a-form-item
        name="studentType"
        :label="t('recruitment.form.studentType')"
        class="mb-4"
      >
        <a-radio-group 
          v-model:value="formData.studentType" 
          size="large"
          @change="handleStudentTypeChange"
          class="student-type-group"
        >
          <a-radio-button value="hust">
            <i class="fas fa-university"></i>
            {{ t('recruitment.form.hustStudent') }}
          </a-radio-button>
          <a-radio-button value="external">
            <i class="fas fa-graduation-cap"></i>
            {{ t('recruitment.form.externalStudent') }}
          </a-radio-button>
        </a-radio-group>
      </a-form-item>

      <!-- Personal Information -->
      <div class="form-section">
        <h4 class="form-section-title">
          <i class="fas fa-user"></i>
          {{ t('recruitment.form.personalInfo') }}
        </h4>

        <!-- Full Name -->
        <a-form-item
          name="fullName"
          :label="t('recruitment.form.fullName')"
        >
          <a-input
            v-model:value="formData.fullName"
            size="large"
            :placeholder="t('recruitment.form.fullNamePlaceholder')"
          >
            <template #prefix>
              <i class="fas fa-user input-icon"></i>
            </template>
          </a-input>
        </a-form-item>

        <!-- MSSV or School -->
        <a-form-item
          name="identifier"
          :label="formData.studentType === 'hust' ? t('recruitment.form.mssv') : t('recruitment.form.school')"
        >
          <a-input
            v-model:value="formData.identifier"
            size="large"
            :placeholder="formData.studentType === 'hust' ? 
              t('recruitment.form.mssvPlaceholder') : 
              t('recruitment.form.schoolPlaceholder')"
          >
            <template #prefix>
              <i :class="formData.studentType === 'hust' ? 'fas fa-id-card' : 'fas fa-school'" class="input-icon"></i>
            </template>
          </a-input>
        </a-form-item>

        <!-- Major/Class or Major -->
        <a-form-item
          name="majorClass"
          :label="formData.studentType === 'hust' ? 
            t('recruitment.form.majorClass') : 
            t('recruitment.form.major')"
        >
          <a-input
            v-model:value="formData.majorClass"
            size="large"
            :placeholder="formData.studentType === 'hust' ? 
              t('recruitment.form.majorClassPlaceholder') : 
              t('recruitment.form.majorPlaceholder')"
          >
            <template #prefix>
              <i class="fas fa-book input-icon"></i>
            </template>
          </a-input>
        </a-form-item>

        <!-- Email -->
        <a-form-item
          name="email"
          :label="t('recruitment.form.email')"
        >
          <a-input
            v-model:value="formData.email"
            size="large"
            type="email"
            :placeholder="formData.studentType === 'hust' ? 
              t('recruitment.form.hustEmailPlaceholder') : 
              t('recruitment.form.personalEmailPlaceholder')"
          >
            <template #prefix>
              <i class="fas fa-envelope input-icon"></i>
            </template>
          </a-input>
        </a-form-item>

        <!-- Phone -->
        <a-form-item
          name="phone"
          :label="t('recruitment.form.phone')"
        >
          <a-input
            v-model:value="formData.phone"
            size="large"
            :placeholder="t('recruitment.form.phonePlaceholder')"
          >
            <template #prefix>
              <i class="fas fa-phone input-icon"></i>
            </template>
          </a-input>
        </a-form-item>
      </div>

      <!-- Department Selection -->
      <div class="form-section">
        <h4 class="form-section-title">
          <i class="fas fa-layer-group"></i>
          {{ t('recruitment.form.departmentSelection') }}
        </h4>

        <!-- Main Department -->
        <a-form-item
          name="mainDepartment"
          :label="t('recruitment.form.mainDepartment')"
        >
          <a-radio-group 
            v-model:value="formData.mainDepartment" 
            class="department-radio-group"
          >
            <div class="department-grid">
              <a-radio value="ai" class="department-radio">
                <div class="department-card">
                  <i class="fas fa-brain"></i>
                  <span>{{ t('recruitment.departments.ai') }}</span>
                </div>
              </a-radio>
              <a-radio value="electrical" class="department-radio">
                <div class="department-card">
                  <i class="fas fa-bolt"></i>
                  <span>{{ t('recruitment.departments.electrical') }}</span>
                </div>
              </a-radio>
              <a-radio value="simulation" class="department-radio">
                <div class="department-card">
                  <i class="fas fa-desktop"></i>
                  <span>{{ t('recruitment.departments.simulation') }}</span>
                </div>
              </a-radio>
              <a-radio value="experiment" class="department-radio">
                <div class="department-card">
                  <i class="fas fa-flask"></i>
                  <span>{{ t('recruitment.departments.experiment') }}</span>
                </div>
              </a-radio>
            </div>
          </a-radio-group>
        </a-form-item>

        <!-- Sub Departments -->
        <a-form-item
          :label="t('recruitment.form.subDepartments')"
        >
          <a-checkbox-group 
            v-model:value="formData.subDepartments"
            class="sub-department-group"
          >
            <div class="sub-department-grid">
              <a-checkbox value="communication" class="sub-department-checkbox">
                <div class="sub-department-card">
                  <i class="fas fa-bullhorn"></i>
                  <span>{{ t('recruitment.departments.communication') }}</span>
                </div>
              </a-checkbox>
              <a-checkbox value="english" class="sub-department-checkbox">
                <div class="sub-department-card">
                  <i class="fas fa-language"></i>
                  <span>{{ t('recruitment.departments.english') }}</span>
                </div>
              </a-checkbox>
              <a-checkbox value="manufacturing" class="sub-department-checkbox">
                <div class="sub-department-card">
                  <i class="fas fa-cogs"></i>
                  <span>{{ t('recruitment.departments.manufacturing') }}</span>
                </div>
              </a-checkbox>
            </div>
          </a-checkbox-group>
          <div class="sub-department-note">
            <i class="fas fa-info-circle"></i>
            {{ t('recruitment.form.subDepartmentNote') }}
          </div>
        </a-form-item>
      </div>

      <!-- CV Upload -->
      <div class="form-section">
        <h4 class="form-section-title">
          <i class="fas fa-file-upload"></i>
          {{ t('recruitment.form.cvUpload') }}
        </h4>

        <a-form-item
          name="cvFile"
          :label="t('recruitment.form.cvUpload')"
        >
          <FileUpload
            v-model="formData.cvFile"
            :accepted-types="'application/pdf,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'"
            :max-size="'5MB'"
            @error="handleFileUploadError"
            @file-added="handleFileAdded"
            @file-removed="handleFileRemoved"
          />
          <div class="cv-upload-note">
            <i class="fas fa-lightbulb"></i>
            {{ t('recruitment.form.cvFileUploadNote') }}
          </div>
        </a-form-item>
      </div>

      <!-- Questions/Comments Section -->
      <div class="form-section">
        <h4 class="form-section-title">
          <i class="fas fa-question-circle"></i>
          {{ t('recruitment.form.questionsComments') }}
        </h4>

        <a-form-item
          name="questions"
          :label="t('recruitment.form.questions')"
        >
          <a-textarea
            v-model:value="formData.questions"
            size="large"
            :placeholder="t('recruitment.form.questionsPlaceholder')"
            :rows="4"
            :maxlength="1000"
            show-count
          />
          <div class="questions-note">
            <i class="fas fa-info-circle"></i>
            {{ t('recruitment.form.questionsNote') }}
          </div>
        </a-form-item>
      </div>

      <!-- Draft Actions -->
      <div class="draft-actions" v-if="savedDraft">
        <div class="draft-info">
          <i class="fas fa-info-circle"></i>
          <span>{{ t('recruitment.draft.autoSaved') }}</span>
        </div>
        <a-button 
          type="text" 
          danger
          @click="confirmClearDraft"
          class="clear-draft-btn"
        >
          <i class="fas fa-trash-alt"></i>
          {{ t('recruitment.draft.clear') }}
        </a-button>
      </div>

      <!-- Submit Button -->
      <a-form-item class="submit-section">
        <a-space direction="vertical" size="middle" style="width: 100%">
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            :loading="loading"
            block
            class="submit-button"
          >
            <i class="fas fa-paper-plane"></i>
            {{ t('recruitment.form.submit') }}
          </a-button>
          
          <div class="draft-manual-actions">
            <a-space>
              <a-button
                type="default"
                size="small"
                @click="saveDraft"
                class="save-draft-btn"
              >
                <i class="fas fa-save"></i>
                {{ t('recruitment.draft.saveNow') }}
              </a-button>
            </a-space>
          </div>
        </a-space>
      </a-form-item>

    </a-form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, nextTick, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import FileUpload from '@/components/FileUpload.vue';

const { t } = useI18n();
const emit = defineEmits(['submit']);

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

const formRef = ref();

// Define storage keys
const DRAFT_STORAGE_KEY = 'recruitment-form-draft';
const SUBMISSION_STORAGE_KEY = 'recruitment-form-submitted';

// Create reactive storage for form draft
const savedDraft = useStorage(DRAFT_STORAGE_KEY, null, localStorage, {
  mergeDefaults: false,
  serializer: {
    read: (value) => {
      try {
        return value ? JSON.parse(value) : null;
      } catch {
        return null;
      }
    },
    write: (value) => JSON.stringify(value)
  }
});

// Create reactive storage for submission status
const submissionStatus = useStorage(SUBMISSION_STORAGE_KEY, null, localStorage, {
  mergeDefaults: false,
  serializer: {
    read: (value) => {
      try {
        return value ? JSON.parse(value) : null;
      } catch {
        return null;
      }
    },
    write: (value) => JSON.stringify(value)
  }
});

const formData = reactive({
  studentType: 'hust',
  fullName: '',
  identifier: '', // MSSV or School name
  majorClass: '', // Major + Class or just Major
  email: '',
  phone: '',
  mainDepartment: '',
  subDepartments: [],
  cvFile: null, // For file upload
  questions: '' // Questions/comments for the club
});

// Load saved draft when component mounts
onMounted(() => {
  loadDraft();
});

// Auto-save draft when form data changes (debounced)
let saveTimeout = null;
watch(formData, () => {
  // Clear existing timeout
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  
  // Set new timeout to save after 1 second of inactivity
  saveTimeout = setTimeout(() => {
    saveDraft();
  }, 1000);
}, { deep: true });

const loadDraft = () => {
  if (savedDraft.value) {
    try {
      Object.assign(formData, savedDraft.value);
      nextTick(() => {
        message.info(t('recruitment.draft.loaded'));
      });
    } catch (error) {
      console.error('Error loading draft:', error);
      clearDraft();
    }
  }
};

const saveDraft = () => {
  // Only save if form has some data
  const hasData = Object.values(formData).some(value => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value && value.toString().trim() !== '';
  });
  
  if (hasData) {
    savedDraft.value = { ...formData };
  }
};

const clearDraft = () => {
  savedDraft.value = null;
  if (saveTimeout) {
    clearTimeout(saveTimeout);
    saveTimeout = null;
  }
};

const confirmClearDraft = () => {
  // Show confirmation before clearing
  const confirmed = window.confirm(t('recruitment.draft.confirmClear'));
  if (confirmed) {
    // Reset form data
    Object.assign(formData, {
      studentType: 'hust',
      fullName: '',
      identifier: '',
      majorClass: '',
      email: '',
      phone: '',
      mainDepartment: '',
      subDepartments: [],
      cvLink: '',
      questions: ''
    });
    
    clearDraft();
    message.success(t('recruitment.draft.cleared'));
    
    // Clear form validation
    if (formRef.value) {
      formRef.value.resetFields();
    }
  }
};

const confirmResetSubmission = () => {
  const confirmed = window.confirm(t('recruitment.success.confirmReset'));
  if (confirmed) {
    submissionStatus.value = null;
    message.success(t('recruitment.success.resetSuccess'));
  }
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const rules = computed(() => {
  const isHustStudent = formData.studentType === 'hust';
  
  const identifierRules = [
    { 
      required: true, 
      message: isHustStudent ? 
        t('recruitment.validation.mssvRequired') : 
        t('recruitment.validation.schoolRequired') 
    }
  ];
  
  if (isHustStudent) {
    identifierRules.push({
      validator: (rule, value) => {
        if (!value) return Promise.resolve();
        const mssv = parseInt(value);
        if (isNaN(mssv) || mssv < 20210000 || mssv > 202599999) {
          return Promise.reject(t('recruitment.validation.mssvRange'));
        }
        return Promise.resolve();
      }
    });
  }
  
  const emailRules = [
    { required: true, message: t('recruitment.validation.emailRequired') },
    { type: 'email', message: t('recruitment.validation.emailInvalid') }
  ];
  
  // Only add HUST email pattern for HUST students
  if (isHustStudent) {
    emailRules.push({
      pattern: /@(sis\.)?hust\.edu\.vn$/,
      message: t('recruitment.validation.hustEmailInvalid')
    });
  }
  // For non-HUST students, any valid email format is acceptable
  
  return {
    studentType: [
      { required: true, message: t('recruitment.validation.studentTypeRequired') }
    ],
    fullName: [
      { required: true, message: t('recruitment.validation.fullNameRequired') },
      { min: 2, message: t('recruitment.validation.fullNameMin') }
    ],
    identifier: identifierRules,
    majorClass: [
      { 
        required: true, 
        message: isHustStudent ? 
          t('recruitment.validation.majorClassRequired') : 
          t('recruitment.validation.majorRequired') 
      }
    ],
    email: emailRules,
    phone: [
      { required: true, message: t('recruitment.validation.phoneRequired') },
      { pattern: /^(0[3|5|7|8|9])+([0-9]{8})$/, message: t('recruitment.validation.phoneInvalid') }
    ],
    mainDepartment: [
      { required: true, message: t('recruitment.validation.mainDepartmentRequired') }
    ],
    cvFile: [
      { required: true, message: t('recruitment.validation.cvFileRequired') }
    ]
  };
});

const handleStudentTypeChange = () => {
  // Reset form when changing student type
  formData.identifier = '';
  formData.majorClass = '';
  formData.email = '';
  
  // Clear validation errors
  formRef.value?.clearValidate(['identifier', 'majorClass', 'email']);
};

// Handle file upload events
const handleFileUploadError = (error) => {
  console.error('File upload error:', error);
  // Error is already displayed by FileUpload component
};

const handleFileAdded = (fileData) => {
  console.log('File added to form:', fileData.name);
  message.success(`File "${fileData.name}" đã được tải lên thành công`);
};

const handleFileRemoved = (file) => {
  console.log('File removed from form:', file.filename);
  message.info('File đã được xóa');
};

const handleSubmit = async () => {
  // Check if form has already been submitted
  if (submissionStatus.value) {
    message.error(t('recruitment.validation.alreadySubmitted'));
    return;
  }

  try {
    await formRef.value.validate();
    
    const submitData = {
      studentType: formData.studentType,
      fullName: formData.fullName,
      identifier: formData.identifier,
      majorClass: formData.majorClass,
      email: formData.email,
      phone: formData.phone,
      mainDepartment: formData.mainDepartment,
      subDepartments: formData.subDepartments,
      cvFile: formData.cvFile,
      questions: formData.questions
    };

    // Mark as submitted before emit to prevent multiple submissions
    submissionStatus.value = {
      submitted: true,
      timestamp: new Date().toISOString(),
      candidateName: formData.fullName
    };

    // Clear draft after successful submission
    clearDraft();
    
    emit('submit', submitData);
  } catch (error) {
    console.error('Validation failed:', error);
    message.error(t('recruitment.form.validationError'));
  }
};
</script>

<style lang="scss" scoped>
.recruitment-form {
  max-width: 100%;
}

.form-section {
  margin-bottom: 40px;
  padding: 30px;
  background: $color-gray-3;
  border-radius: 8px;
  border: 1px solid $color-gray-5;
}

.form-section-title {
  font-family: $vietnam-font-2;
  color: #181c32;
  font-size: 18px;
  font-weight: $fw-semibold;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
  
  i {
    color: $color-primary;
    font-size: 20px;
  }
}

.input-icon {
  color: $color-gray-7;
  font-size: 14px;
}

/* Student Type Radio Buttons */
.student-type-group {
  width: 100%;
  display: flex;
  gap: 12px;
  
  :deep(.ant-radio-button-wrapper) {
    height: 48px;
    line-height: 46px;
    padding: 0 24px;
    font-size: 15px;
    border-radius: 6px !important;
    border: 1px solid $color-gray-5;
    background: white;
    flex: 1;
    text-align: center;
    
    &:hover {
      border-color: $color-primary;
      color: $color-primary;
    }
    
    &.ant-radio-button-wrapper-checked {
      background: $color-primary;
      border-color: $color-primary;
      color: white;
      
      &:hover {
        background: $color-primary;
        border-color: $color-primary;
        color: white;
      }
    }
    
    i {
      margin-right: 8px;
    }
  }
}

/* Department Selection */
.department-radio-group {
  width: 100%;
}

.department-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.department-radio {
  display: block;
  margin: 0;
  
  :deep(.ant-radio) {
    display: none;
  }
}

.department-card {
  padding: 20px;
  border: 2px solid $color-gray-5;
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;
  min-height: 120px;
  
  &:hover {
    border-color: $color-primary;
    box-shadow: $shadow-2;
  }
  
  i {
    font-size: 28px;
    color: $color-gray-7;
    margin-bottom: 12px;
    display: block;
  }
  
  span {
    font-size: 14px;
    font-weight: $fw-semibold;
    color: #181c32;
    line-height: 1.3;
  }
}

:deep(.ant-radio-wrapper.department-radio.ant-radio-wrapper-checked .department-card) {
  border-color: $color-primary;
  background: $color-gray-3;
  box-shadow: $shadow-3;
  
  i {
    color: $color-primary;
  }
}

/* Sub Department Selection */
.sub-department-group {
  width: 100%;
}

.sub-department-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.sub-department-checkbox {
  display: block;
  margin: 0;
  
  :deep(.ant-checkbox) {
    display: none;
  }
}

.sub-department-card {
  padding: 20px 16px;
  border: 1px solid $color-gray-5;
  border-radius: 6px;
  text-align: center;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;
  
  i {
    font-size: 24px;
    color: $color-gray-7;
    margin-bottom: 10px;
    display: block;
    transition: color 0.3s ease;
  }
  
  span {
    font-size: 14px;
    font-weight: $fw-semibold;
    color: #181c32;
    transition: color 0.3s ease;
  }
}

// Hover state for unchecked checkboxes
.sub-department-checkbox:not(.ant-checkbox-wrapper-checked) .sub-department-card:hover {
  border-color: $color-gray-6;
  background: $color-gray-2;
  
  i {
    color: $color-gray-8;
  }
}

// Checked state styling
:deep(.ant-checkbox-wrapper.sub-department-checkbox.ant-checkbox-wrapper-checked .sub-department-card) {
  border-color: $color-primary;
  background: lighten($color-primary, 45%);
  box-shadow: 0 2px 8px rgba($color-primary, 0.15);
  
  i {
    color: $color-primary;
  }
  
  span {
    color: $color-primary;
  }
}

// Hover state for checked checkboxes
:deep(.ant-checkbox-wrapper.sub-department-checkbox.ant-checkbox-wrapper-checked .sub-department-card:hover) {
  border-color: darken($color-primary, 10%);
  background: lighten($color-primary, 40%);
  box-shadow: 0 4px 12px rgba($color-primary, 0.2);
}

.sub-department-note {
  padding: 12px 16px;
  background: white;
  border-radius: 6px;
  color: $color-gray-7;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid $color-gray-5;
  
  i {
    color: $color-warning;
  }
}

/* CV Upload Section */
.cv-upload-note {
  margin-top: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  color: $color-gray-7;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid $color-gray-5;
  
  i {
    color: $color-warning;
  }
}

/* Questions/Comments Section */
.questions-note {
  margin-top: 30px;
  padding: 8px 12px;
  background: lighten($color-primary, 45%);
  border-radius: 6px;
  color: darken($color-primary, 15%);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid lighten($color-primary, 25%);
  
  i {
    color: $color-primary;
  }
}

/* Submit Section */
.submit-section {
  margin-top: 40px;
  margin-bottom: 0;
}

.submit-button {
  height: 48px;
  font-size: 16px;
  font-weight: $fw-semibold;
  border-radius: 6px;
  background: $color-primary;
  border-color: $color-primary;
  box-shadow: $shadow-2;
  
  &:hover {
    background: darken($color-primary, 10%);
    border-color: darken($color-primary, 10%);
    box-shadow: $shadow-3;
  }
  
  i {
    margin-right: 8px;
  }
}

/* Draft Actions */
.draft-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: lighten($color-warning, 35%);
  border: 1px solid lighten($color-warning, 20%);
  border-radius: 6px;
  margin-bottom: 24px;
  
  .draft-info {
    display: flex;
    align-items: center;
    gap: 8px;
    color: darken($color-warning, 20%);
    font-size: 13px;
    
    i {
      color: $color-warning;
    }
  }
}

.clear-draft-btn {
  font-size: 12px;
  height: auto;
  padding: 4px 8px;
  
  i {
    margin-right: 4px;
    font-size: 11px;
  }
  
  &:hover {
    background: rgba($color-danger, 0.1);
  }
}

.draft-manual-actions {
  text-align: center;
}

.save-draft-btn {
  font-size: 13px;
  height: 32px;
  border-color: $color-gray-5;
  color: $color-gray-7;
  
  i {
    margin-right: 6px;
    font-size: 12px;
  }
  
  &:hover {
    border-color: $color-primary;
    color: $color-primary;
  }
}

/* Submission Complete */
.submission-complete {
  text-align: center;
  padding: 60px 40px;
  background: white;
  border-radius: 12px;
  border: 2px solid $color-success;
  
  .success-icon {
    font-size: 80px;
    color: $color-success;
    margin-bottom: 24px;
    
    i {
      animation: successPulse 2s ease-in-out infinite;
    }
  }
  
  .success-title {
    font-family: $vietnam-font-2;
    font-size: 24px;
    color: $color-success;
    margin-bottom: 16px;
    font-weight: $fw-semibold;
  }
  
  .success-message {
    font-size: 16px;
    color: #181c32;
    margin-bottom: 12px;
    font-weight: $fw-semibold;
  }
  
  .success-timestamp {
    font-size: 14px;
    color: $color-gray-7;
    margin-bottom: 32px;
  }
  
  .success-actions {
    .reset-btn {
      font-size: 13px;
      padding: 8px 16px;
      
      i {
        margin-right: 6px;
      }
      
      &:hover {
        background: rgba($color-danger, 0.1);
        color: $color-danger;
      }
    }
  }
}

@keyframes successPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Form Content */
:deep(.ant-form-item-label > label) {
  font-weight: $fw-semibold;
  color: #181c32;
  font-size: 14px;
}

:deep(.ant-input), :deep(.ant-input.ant-input) {
  border-radius: 6px;
  border-color: $color-gray-5;
  
  &:hover {
    border-color: $color-primary;
  }
  
  &:focus,
  &.ant-input-focused {
    border-color: $color-primary;
    box-shadow: 0 0 0 2px rgba($color-primary, 0.2);
  }
}

:deep(.ant-input) {
  border-radius: 6px;
  border-color: $color-gray-5;
  
  &:hover {
    border-color: $color-primary;
  }
  
  &:focus,
  &.ant-input-focused {
    border-color: $color-primary;
    box-shadow: 0 0 0 2px rgba($color-primary, 0.2);
  }
}

/* Responsive */
@media (max-width: $md) {
  .form-section {
    padding: 20px;
  }
  
  .department-grid {
    grid-template-columns: 1fr;
  }
  
  .sub-department-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .student-type-group {
    flex-direction: column;
    
    :deep(.ant-radio-button-wrapper) {
      margin-bottom: 8px;
    }
  }
}
</style>