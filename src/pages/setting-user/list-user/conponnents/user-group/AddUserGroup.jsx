import MSCustomizeDrawer from '@/components/Drawer';
import MSFormItem from '@/components/Form/Item';
import { Button, Col, Form, Input, Row } from 'antd';
import React, { useState } from 'react';
import { useIntl } from 'umi';
import { connect } from 'dva';

function AddUserGroup({ dispatch }) {
  const intl = useIntl();
  const [openDrawer1, setOpenDrawer] = useState(false);
  const [form] = Form.useForm();
  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onClose = () => {
    setOpenDrawer(false);
  };

  const handleSubmit = () => {
    const value = form.getFieldsValue(true);

    const payload = {
      ...value,
    };

    dispatch({
      type: 'userGroup/create',
      payload: payload,
    });

    //đóng drawer
    onClose();
  };
  return (
    <div>
      <Button type="primary" onClick={showDrawer}>
        {intl.formatMessage({
          id: 'pages.setting-user.list-user.add-group-user',
        })}
      </Button>
      <MSCustomizeDrawer
        openDrawer={openDrawer1}
        onClose={onClose}
        width={'20%'}
        zIndex={1002}
        title={intl.formatMessage({
          id: 'pages.setting-user.list-user.add-group-user',
        })}
        placement="right"
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={24}>
              <MSFormItem
                label={intl.formatMessage({
                  id: 'pages.setting-user.list-user.name',
                })}
                type="input"
                name="name"
                minLength={5}
                maxLength={255}
                required={true}
              >
                <Input autoComplete="new-password" />
              </MSFormItem>
            </Col>
            <Col span={24}>
              <MSFormItem
                label={intl.formatMessage({
                  id: 'pages.setting-user.list-user.description',
                })}
                type="input"
                name="description"
                minLength={5}
                maxLength={255}
                required={true}
              >
                <Input autoComplete="new-password" />
              </MSFormItem>
            </Col>
          </Row>
        </Form>
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
          <Button htmlType="submit" onClick={handleSubmit} type="primary">
            {intl.formatMessage({
              id: 'pages.setting-user.list-user.add',
            })}
          </Button>
        </div>
      </MSCustomizeDrawer>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.user,
  };
}

export default connect(mapStateToProps)(AddUserGroup);
