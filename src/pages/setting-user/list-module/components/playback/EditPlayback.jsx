import MSFormItem from '@/components/Form/Item';
import { Button, Col, Form, Input, Row } from 'antd';
import React from 'react';
import { useIntl } from 'umi';

const { TextArea } = Input;

const EditPlayback = ({ selectedPlaybackEdit, onClose, dispatch }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const handleSubmit = (value) => {
    dispatch({
      type: 'playback/editPlayback',
      payload: { id: selectedPlaybackEdit.uuid, values: { ...value } },
    });
    onClose();
  };

  return (
    <div>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={selectedPlaybackEdit}
      >
        <Row gutter={16}>
          <Col span={24}>
            <MSFormItem
              label={`${intl.formatMessage({
                id: 'view.common_device.playback_name',
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
        <div
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
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
        </div>
      </Form>
    </div>
  );
};

export default EditPlayback;
