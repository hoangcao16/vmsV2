import { notification } from 'antd';
import { NotificationInstance, NotificationPlacement } from 'antd/lib/notification';
import { appIntl } from '../IntlGlobalProvider';

type NotifyMessage = {
  id: string;
  defaultMessage?: string;
  params?: any;
};

export const notify = (
  type: keyof NotificationInstance,
  message: string | NotifyMessage,
  description: string | NotifyMessage,
  placement?: NotificationPlacement,
) => {
  return notification[type]({
    message:
      typeof message === 'object'
        ? appIntl().formatMessage(
            { id: message.id, defaultMessage: message.defaultMessage },
            message.params,
          )
        : appIntl().formatMessage({ id: message, defaultMessage: message }),
    description:
      typeof description === 'object'
        ? appIntl().formatMessage(
            { id: description.id, defaultMessage: description.defaultMessage },
            description.params,
          )
        : appIntl().formatMessage({ id: description, defaultMessage: description }),
    placement,
  });
};
