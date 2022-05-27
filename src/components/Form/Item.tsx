import { Form, FormItemProps } from 'antd';
import { useCallback } from 'react';
import { appIntl } from '../IntlGlobalProvider';

const MSFormItem = ({
  children,
  type,
  rules = [],
  ...props
}: {
  children: any;
  type: 'input' | 'select' | 'email' | 'tel' | 'long_' | 'lat_' | string;
} & FormItemProps) => {
  const intl = appIntl();

  const getRulesForType = useCallback(
    (type, props) => {
      switch (type) {
        case 'input':
          return [
            {
              max: props.maxLength,
              message: `${intl.formatMessage(
                { id: 'noti.max_characters' },
                { max: props.maxLength },
              )}`,
            },
            {
              min: props.minLength,
              message: `${intl.formatMessage(
                { id: 'noti.min_characters' },
                { min: props.minLength },
              )}`,
            },
            {
              required: props.required,
              message: `${intl.formatMessage({ id: 'view.map.required_field' })}`,
            },
          ];
        case 'select':
          return [
            {
              required: props.required,
              message: `${intl.formatMessage({ id: 'view.map.required_field' })}`,
            },
          ];
        case 'email':
          return [
            {
              max: props.maxLength,
              message: `${intl.formatMessage(
                { id: 'noti.max_characters' },
                { max: props.maxLength },
              )}`,
            },
            {
              min: props.minLength,
              message: `${intl.formatMessage(
                { id: 'noti.min_characters' },
                { min: props.minLength },
              )}`,
            },
            {
              required: props.required,
              message: `${intl.formatMessage({ id: 'view.map.required_field' })}`,
            },
            {
              pattern:
                /^[a-zA-Z0-9]+([\._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([\_-]?[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,4}){1,2}$/,
              message: `${intl.formatMessage({
                id: 'view.user.detail_list.email_address_required',
              })}`,
            },
          ];
        case 'tel':
          return [
            () => ({
              validator(_, value) {
                const valiValue = (
                  document.getElementById('tel') as HTMLInputElement
                ).value.replace(/\s/g, '');
                console.log('valiValue', valiValue);

                if (!valiValue.length) {
                  return Promise.reject(intl.formatMessage({ id: 'view.map.required_field' }));
                }

                if (!valiValue.startsWith('0')) {
                  if (valiValue.length < 9) {
                    return Promise.reject(
                      new Error(intl.formatMessage({ id: 'noti.at_least_9_characters' })),
                    );
                  } else if (valiValue.length > 19) {
                    return Promise.reject(
                      new Error(
                        intl.formatMessage(
                          { id: 'noti.max_characters' },
                          {
                            max: 19,
                          },
                        ),
                      ),
                    );
                  }
                } else {
                  if (valiValue.length < 10) {
                    return Promise.reject(
                      new Error(intl.formatMessage({ id: 'noti.at_least_10_characters' })),
                    );
                  } else if (valiValue.length > 20) {
                    return Promise.reject(
                      new Error(
                        intl.formatMessage(
                          { id: 'noti.max_characters' },
                          {
                            max: 20,
                          },
                        ),
                      ),
                    );
                  }
                }

                return Promise.resolve();
              },
            }),
          ];
        case 'long_':
          return [
            {
              pattern:
                /^(\+|-)?(?:180(?:(?:\.0{1,20})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,20})?))$/,
              message: intl.formatMessage({
                id: 'view.map.long_error',
              }),
            },
          ];
        case 'lat_':
          return [
            {
              pattern:
                /^(\+|-)?(?:90(?:(?:\.0{1,20})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,20})?))$/,
              message: intl.formatMessage({
                id: 'view.map.lat_error',
              }),
            },
          ];

        default:
          return [];
      }
    },
    [type, props],
  );

  return (
    <Form.Item {...props} rules={[...getRulesForType(type, props), ...rules]}>
      {children}
    </Form.Item>
  );
};

export default MSFormItem;
