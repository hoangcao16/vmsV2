import { CloseOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Form, Input, Radio, Select, Space } from 'antd';
import { useState } from 'react';
import { useIntl } from 'umi';
import { MSCustomizeDrawerStyled } from './style';

const OutSideSystemOptions = [
  {
    label: 'Đội CSGT số 1',
    value: 1,
  },
  {
    label: 'Đội CSGT số 2',
    value: 2,
  },
  {
    label: 'Đội CSGT số 3',
    value: 3,
  },
];

function DrawerSendTicket({ isOpenView, handleCancel, handleOk, loadingSendEmail }) {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [value, setValue] = useState(1);

  const onFinish = (values) => {
    if (value === 2) {
      handleOk(values.receiver);
      return;
    }
    handleOk(null);
  };

  const handleSendTicket = () => {
    form.submit();
  };

  const onChange = (e) => {
    setValue(e.target.value);
    form.resetFields(['receiver']);
  };

  return (
    <MSCustomizeDrawerStyled
      openDrawer={isOpenView}
      onClose={handleCancel}
      zIndex={1003}
      width={496}
      extra={
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SendOutlined />}
            loading={loadingSendEmail}
            onClick={handleSendTicket}
          >
            {intl.formatMessage({
              id: 'view.penaltyTicket.send-a-ticket',
            })}
          </Button>

          <Button className="sendTicket-btnCancel" onClick={handleCancel} icon={<CloseOutlined />}>
            {intl.formatMessage({
              id: 'view.penaltyTicket.cancel-a-ticket',
            })}
          </Button>
        </Space>
      }
    >
      <div className="sendTicket-header">
        {intl.formatMessage({
          id: 'view.penaltyTicket.send_ticket',
        })}
      </div>

      <Form
        name="SendTicket"
        autoComplete="off"
        form={form}
        onFinish={onFinish}
        layout={'vertical'}
      >
        <Form.Item
          label={intl.formatMessage({
            id: 'view.penaltyTicket.recipients',
          })}
          name="recipients"
          labelAlign="left"
          initialValue={value}
        >
          <Radio.Group onChange={onChange}>
            <Radio value={1}>
              {intl.formatMessage({
                id: 'view.penaltyTicket.outside-the-system',
              })}
            </Radio>
            <Radio value={2}>
              {intl.formatMessage({
                id: 'view.penaltyTicket.leader',
              })}
            </Radio>
          </Radio.Group>
        </Form.Item>

        {value === 1 && (
          <Form.Item
            label={intl.formatMessage({
              id: 'view.penaltyTicket.receiver',
            })}
            name="receiver"
            labelAlign="left"
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'view.penaltyTicket.select-recipients',
                }),
              },
            ]}
          >
            <Select
              placeholder={intl.formatMessage({
                id: 'view.penaltyTicket.select-recipients',
              })}
              options={OutSideSystemOptions}
            />
          </Form.Item>
        )}

        {value === 2 && (
          <Form.Item
            label={intl.formatMessage({
              id: 'view.penaltyTicket.receiver',
            })}
            name="receiver"
            labelAlign="left"
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'view.penaltyTicket.require-email',
                }),
              },
              {
                pattern:
                  /^([a-zA-Z0-9]+([\._-]?[a-zA-Z0-9]+)@([a-zA-Z0-9]+)+(\.[a-zA-Z]{2,5}){1,2})+(\s*[,]\s*([a-zA-Z0-9]+([\._-]?[a-zA-Z0-9]+)@([a-zA-Z0-9]+)+(\.[a-zA-Z]{2,5}){1,2}))*$/,
                message: intl.formatMessage({
                  id: 'view.penaltyTicket.validate-email',
                }),
              },
              {
                max: 100,
                message: intl.formatMessage({
                  id: 'view.map.max_length_100',
                }),
              },
            ]}
          >
            <Input />
          </Form.Item>
        )}
      </Form>
    </MSCustomizeDrawerStyled>
  );
}

export default DrawerSendTicket;
