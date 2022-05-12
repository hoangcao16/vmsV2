import { notification } from 'antd';

export const NotificationInfo = (title, message, placement = 'topRight') => {
  notification.info({
    message: title,
    description: message,
    placement: placement,
  });
};

export const NotificationSuccess = (title, message, placement = 'topRight') => {
  notification.success({
    message: title,
    description: message,
    placement: placement,
  });
};

export const NotificationError = (title, message, placement = 'topRight') => {
  notification.error({
    message: title,
    description: message,
    placement: placement,
  });
};
