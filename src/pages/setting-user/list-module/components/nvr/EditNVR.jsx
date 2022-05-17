import MSFormItem from '@/components/Form/Item';
import { Button, Col, Form, Input, Row } from 'antd';
import React from 'react';
import { useIntl } from 'umi';
import { DrawerActionStyle } from '../../style';

const { TextArea } = Input;

const EditNVR = ({ selectedNVREdit, onClose, dispatch }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const handleSubmit = (value) => {
    dispatch({
      type: 'nvr/editNVR',
      payload: { id: selectedNVREdit.uuid, values: { ...value } },
    });
    onClose();
  };

  return (
    <div>
      <Form layout="vertical" form={form} onFinish={handleSubmit} initialValues={selectedNVREdit}>
        <Row gutter={16}>
          <Col span={24}>
            <MSFormItem
              label={`${intl.formatMessage({
                id: 'view.common_device.nvr_name',
              })}`}
              type="input"
              name="name"
              minLength={5}
              maxLength={255}
              required={true}
            >
              <Input />
            </MSFormItem>
          </Col>
          <Col span={24}>
            <MSFormItem
              label={`${intl.formatMessage({
                id: 'view.common_device.note',
              })}`}
              type="input"
              name="note"
              minLength={5}
              maxLength={255}
              required={true}
            >
              <TextArea rows={2} />
            </MSFormItem>
          </Col>
          <Col span={24}>
            <MSFormItem
              label={`${intl.formatMessage({
                id: 'view.common_device.desc',
              })}`}
              type="input"
              name="description"
              minLength={5}
              maxLength={255}
              required={true}
            >
              <TextArea rows={2} />
            </MSFormItem>
          </Col>
        </Row>
        <DrawerActionStyle>
          <Button onClick={onClose} type="danger">
            {`${intl.formatMessage({
              id: 'view.user.detail_list.cancel',
            })}`}
          </Button>
          <Button htmlType="submit" type="ghost">
            {`${intl.formatMessage({
              id: 'view.user.detail_list.edit',
            })}`}
          </Button>
        </DrawerActionStyle>
      </Form>
    </div>
  );
};

export default EditNVR;
