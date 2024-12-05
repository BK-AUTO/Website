import { useHead } from '@unhead/vue';
import { useI18n } from 'vue-i18n';
import { Modal, notification } from 'ant-design-vue';

let siteTitle = 'BK Auto';
let separator = '|';

export const useTitle = (label) => {
  const { t } = useI18n();
  return useHead({
    title: t(label) + ` ${separator} ${siteTitle}`,
  });
};

export const showNotificationError = (t, msgData) => {
  let message;
  if (msgData.response && msgData.response.data) {
    if (msgData.response.data.alerts) {
      message = msgData.response.data.alerts[0].message;
    } else {
      message = msgData.response.data.error || 'Server error';
    }
  } else {
    message = msgData.message ? msgData.message : msgData;
  }

  if (msgData.response && msgData.response.status === 401) {
    notification.destroy();
    notification['warning']({
      placement: 'top',
      message: t(`prompt.sessionExpired`),
      description: t(`prompt.restartLogin`),
    });
  } else {
    notification['error']({
      message: t(`prompt.error`),
      description: message,
    });
  }
};

export const showNotification = (t, message, type = 'success') => {
  notification[type]({
    message: t(`label.${type}`),
    description: message,
  });
};

export const showWarningModal = (t, content) => {
  Modal.warning({
    title: t(`label.warning`),
    content,
  });
};

export const formatDateString = (isoDateString) => {
  const date = new Date(isoDateString);
  const formattedDateString = date.toLocaleString();
  return formattedDateString;
};

const createDefaultFile = async() => {
  const response = await fetch(this.defaultImagePath);
  const blob = await response.blob();
  return new File([blob], '@/assets/img/background/bg-default.png', { type: blob.type });
};
