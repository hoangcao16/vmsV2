import { notification } from 'antd';
import { NotificationInstance, NotificationPlacement } from 'antd/lib/notification';
import { appIntl } from '../IntlGlobalProvider';

export const notify = (
  type: keyof NotificationInstance,
  message: string,
  description: string,
  placement?: NotificationPlacement,
) => {
  return notification[type]({
    message: appIntl().formatMessage({ id: message, defaultMessage: message }),
    description: appIntl().formatMessage({ id: description, defaultMessage: description }),
    placement,
  });
};
