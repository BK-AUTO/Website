<template>
  <div class="file-upload-wrapper">
    <FilePond
      :ref="pondRef"
      name="file"
      :label-idle="labelIdle"
      :accepted-file-types="acceptedFileTypes"
      :allow-multiple="false"
      :max-file-size="maxFileSize"
      :files="files"
      @init="handleFilePondInit"
      @addfile="handleAddFile"
      @removefile="handleRemoveFile"
      @error="handleError"
      :server="{
        process: null,
        revert: null,
        restore: null,
        load: null,
        fetch: null
      }"
      class="custom-filepond"
    />
    <div v-if="uploadError" class="upload-error">
      <i class="fas fa-exclamation-triangle"></i>
      {{ uploadError }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

// Import Vue FilePond
import vueFilePond from 'vue-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Import FilePond plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';

// Create FilePond component
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize
);

const { t } = useI18n();

// Props
const props = defineProps({
  modelValue: {
    type: [File, String, null],
    default: null
  },
  acceptedTypes: {
    type: String,
    default: 'application/pdf,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  },
  maxSize: {
    type: String,
    default: '5MB'
  },
  required: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['update:modelValue', 'error', 'file-added', 'file-removed']);

// Refs
const pondRef = ref('pond');
const files = ref([]);
const uploadError = ref('');

// Computed
const acceptedFileTypes = props.acceptedTypes;
const maxFileSize = props.maxSize;
const labelIdle = t('recruitment.form.cvUploadLabel', {
  defaultMessage: 'Kéo thả file CV vào đây hoặc <span class="filepond--label-action">Chọn file</span><br>Hỗ trợ: PDF, DOC, DOCX (Tối đa 5MB)'
});

// Methods
const handleFilePondInit = () => {
  console.log('FilePond initialized');
};

const handleAddFile = (error, file) => {
  if (error) {
    console.error('FilePond add file error:', error);
    uploadError.value = error.body || 'Có lỗi xảy ra khi thêm file';
    emit('error', error);
    return;
  }

  uploadError.value = '';
  console.log('File added:', file.filename);
  
  // Keep the original File object instead of converting to base64
  const fileData = {
    name: file.filename,
    size: file.fileSize,
    type: file.fileType,
    file: file.file // Keep original File object for FormData
  };
  
  emit('update:modelValue', fileData);
  emit('file-added', fileData);
};

const handleRemoveFile = (error, file) => {
  if (error) {
    console.error('FilePond remove file error:', error);
    return;
  }
  
  console.log('File removed:', file.filename);
  emit('update:modelValue', null);
  emit('file-removed', file);
  uploadError.value = '';
};

const handleError = (error) => {
  console.error('FilePond error:', error);
  
  // Handle different types of errors
  if (error.type === 'error' && error.body) {
    if (error.body.includes('file size')) {
      uploadError.value = t('recruitment.validation.fileSizeError', { maxSize: maxFileSize });
    } else if (error.body.includes('file type')) {
      uploadError.value = t('recruitment.validation.fileTypeError');
    } else {
      uploadError.value = error.body;
    }
  } else {
    uploadError.value = t('recruitment.validation.fileError');
  }
  
  emit('error', error);
};

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (!newValue && files.value.length > 0) {
    // Clear files if modelValue is set to null externally
    files.value = [];
  }
}, { deep: true });
</script>

<style lang="scss" scoped>
.file-upload-wrapper {
  width: 100%;
}

.custom-filepond {
  :deep(.filepond--root) {
    font-family: 'Be Vietnam Pro', sans-serif;
  }

  :deep(.filepond--drop-label) {
    color: #6c757d;
    font-size: 14px;
  }

  :deep(.filepond--label-action) {
    color: #007bff;
    text-decoration: underline;
  }

  :deep(.filepond--panel-root) {
    border: 2px dashed #dee2e6;
    border-radius: 8px;
    background-color: #f8f9fa;
    transition: all 0.3s ease;

    &:hover {
      border-color: #007bff;
      background-color: #e7f3ff;
    }
  }

  :deep(.filepond--item) {
    border-radius: 6px;
  }

  :deep(.filepond--item-panel) {
    background-color: #ffffff;
    border: 1px solid #dee2e6;
  }

  :deep(.filepond--file-info-main) {
    color: #495057;
    font-weight: 500;
  }

  :deep(.filepond--file-info-sub) {
    color: #6c757d;
  }

  :deep(.filepond--action-process-item) {
    display: none !important;
  }

  :deep(.filepond--item-state-processing) {
    .filepond--item-panel {
      background-color: #e7f3ff;
      border-color: #007bff;
    }
  }

  :deep(.filepond--item-state-processing-complete) {
    .filepond--item-panel {
      background-color: #d1f2eb;
      border-color: #28a745;
    }
  }

  :deep(.filepond--item-state-processing-error) {
    .filepond--item-panel {
      background-color: #f8d7da;
      border-color: #dc3545;
    }
  }
}

.upload-error {
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  color: #721c24;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;

  i {
    color: #dc3545;
  }
}

@media (max-width: 768px) {
  :deep(.filepond--drop-label) {
    font-size: 12px;
  }
}
</style>