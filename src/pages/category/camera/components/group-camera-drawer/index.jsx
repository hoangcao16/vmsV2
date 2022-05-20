/* eslint-disable react-hooks/exhaustive-deps */
import { StyledDrawer } from './style';
import { connect } from 'dva';
import { useIntl } from 'umi';
import { Space, Button, Form, Input, Row, Col } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import isEmpty from 'lodash/isEmpty';
import { useEffect } from 'react';
const GroupCameraDrawer = ({
  dispatch,
  isOpenDrawer,
  setIsOpenDrawer,
  cameraGroupUuid,
  closeDrawerState,
  isEdit,
  setIsEdit,
  selectedGroupCamera,
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  // fill data if isedit
  useEffect(() => {
    if (isEdit) {
      dispatch({
        type: 'groupcamera/fetchGroupCameraByUuid',
        payload: cameraGroupUuid,
      });
    }
  }, [isEdit]);
  // fill data if isOpenDrawer
  useEffect(() => {
    if (isEdit) {
      for (const key in selectedGroupCamera) {
        if (selectedGroupCamera.hasOwnProperty(key)) {
          form.setFieldsValue({
            [key]: selectedGroupCamera[key],
          });
        }
      }
    }
  }, [selectedGroupCamera]);
  const onClose = () => {
    setIsOpenDrawer(false);
    setIsEdit(false);
    form.resetFields();
  };
  useEffect(() => {
    onClose();
  }, [closeDrawerState]);
  const handleSubmit = async (value) => {
    if (isEdit) {
      await dispatch({
        type: 'groupcamera/updateGroupCamera',
        payload: value,
        uuid: cameraGroupUuid,
      });
    } else {
      const payload = {
        ...value,
        parent: cameraGroupUuid,
      };
      if (isEmpty(payload?.parent)) {
        delete payload.parent;
      }
      dispatch({
        type: 'groupcamera/createNewGroupCamera',
        payload,
      });
    }
  };
  return (
    <StyledDrawer
      openDrawer={isOpenDrawer}
      onClose={onClose}
      width={'80%'}
      zIndex={1001}
      placement="right"
      extra={
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              form.submit();
            }}
          >
            <SaveOutlined />
            {intl.formatMessage({ id: 'view.map.button_save' })}
          </Button>
          <Button onClick={onClose}>
            <CloseOutlined />
            {intl.formatMessage({ id: 'view.map.cancel' })}
          </Button>
        </Space>
      }
    >
      <Form className="bg-grey" form={form} onFinish={handleSubmit}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name={['name']}
              rules={[
                {
                  required: true,
                  message: `${intl.formatMessage({ id: 'view.map.required_field' })}`,
                },
                { max: 255, message: `${intl.formatMessage({ id: 'noti.255_characters_limit' })}` },
              ]}
              label={intl.formatMessage({ id: 'view.camera.camera_group_name' })}
            >
              <Input
                placeholder={intl.formatMessage(
                  { id: 'view.camera.please_enter_new_camera_group_name' },
                  {
                    plsEnter: intl.formatMessage({ id: 'please_enter' }),
                    cam: intl.formatMessage({ id: 'camera' }),
                  },
                )}
                onBlur={(e) => {
                  form.setFieldsValue({
                    name: e.target.value.trim(),
                  });
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  form.setFieldsValue({
                    name: e.clipboardData.getData('text').trim(),
                  });
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={['description']}
              rules={[
                {
                  required: true,
                  message: `${intl.formatMessage({ id: 'view.map.required_field' })}`,
                },
                { max: 255, message: `${intl.formatMessage({ id: 'noti.255_characters_limit' })}` },
              ]}
              label={intl.formatMessage({ id: 'view.common_device.desc' })}
            >
              <Input.TextArea
                autoSize
                placeholder={intl.formatMessage({ id: 'view.user.detail_list.desc' })}
                onBlur={(e) => {
                  form.setFieldsValue({
                    description: e.target.value.trim(),
                  });
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  form.setFieldsValue({
                    description: e.clipboardData.getData('text').trim(),
                  });
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </StyledDrawer>
  );
};

function mapStateToProps(state) {
  const { closeDrawerState, selectedGroupCamera } = state.groupcamera;
  return {
    closeDrawerState,
    selectedGroupCamera,
  };
}
export default connect(mapStateToProps)(GroupCameraDrawer);
