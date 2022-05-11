import { notification } from 'antd';

export const NotificationInfo = (title, message, placement = 'bottomRight') => {
  notification.info({
    message: title,
    description: message,
    placement: placement,
  });
};

export const NotificationSuccess = (title, message, placement = 'bottomRight') => {
  notification.success({
    message: title,
    description: message,
    placement: placement,
  });
};

export const NotificationError = (title, message, placement = 'bottomRight') => {
  notification.error({
    message: title,
    description: message,
    placement: placement,
  });
};
