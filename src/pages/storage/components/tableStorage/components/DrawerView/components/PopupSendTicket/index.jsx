import { CloseOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Radio, Select } from 'antd';
import React, { useState } from 'react';
import { useIntl } from 'umi';
import { Wrapper } from './style';

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

function PopupSendTicket({ isModalVisible, handleOk, handleCancel, loadingSendEmail }) {
  const intl = useIntl();
  const [value, setValue] = useState(1);
  const [form] = Form.useForm();

  const onChange = (e) => {
    setValue(e.target.value);
    form.resetFields(['receiver']);
  };

  const onFinish = (values) => {
    if (value === 2) {
      handleOk(values.receiver);
      return;
    }
    handleOk(null);
  };

  return (
    <Modal
      title={false}
      closable={false}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      zIndex={1002}
      maskClosable={false}
      footer={false}
      width={600}
      afterClose={() => {
        form.resetFields();
        setValue(1);
      }}
    >
      <Wrapper>
        <div className="sendTicket-header">
          {intl.formatMessage({
            id: 'view.penaltyTicket.send_ticket',
          })}
        </div>

        <Form
          name="SendTicket"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          autoComplete="off"
          form={form}
          onFinish={onFinish}
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
              <Input
                onBlur={(e) => {
                  form.setFieldsValue({
                    receiver: e.target.value.trim(),
                  });
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  form.setFieldsValue({
                    receiver: e.clipboardData.getData('text').trim(),
                  });
                }}
              />
            </Form.Item>
          )}

          <div className="sendTicket-containerBtn">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SendOutlined />}
                loading={loadingSendEmail}
              >
                {intl.formatMessage({
                  id: 'view.penaltyTicket.send-a-ticket',
                })}
              </Button>
            </Form.Item>

            <Button
              className="sendTicket-btnCancel"
              onClick={handleCancel}
              icon={<CloseOutlined />}
            >
              {intl.formatMessage({
                id: 'view.penaltyTicket.cancel-a-ticket',
              })}
            </Button>
          </div>
        </Form>
      </Wrapper>
    </Modal>
  );
}

export default PopupSendTicket;
