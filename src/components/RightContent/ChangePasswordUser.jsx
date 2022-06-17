import MSCustomizeDrawer from '@/components/Drawer';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { Button, Form, Row, Col, Input, Space } from 'antd';
import { useIntl } from 'umi';
import { connect } from 'dva';
import React, { useState } from 'react';
function ChangePassword({ openDrawer, onClose }) {
  const intl = useIntl();
  const [form] = Form.useForm();
  const formItemLayout = {
    wrapperCol: { span: 24 },
    labelCol: { span: 10 },
  };
  return (
    <>
      {openDrawer && (
        <MSCustomizeDrawer
          openDrawer={openDrawer}
          onClose={onClose}
          width={'30%'}
          zIndex={1001}
          placement="right"
          title={intl.formatMessage({
            id: 'view.user.change_password',
          })}
          extra={
            <Space>
              <Button onClick={onClose}>
                <CloseOutlined />
                {intl.formatMessage({ id: 'view.map.cancel' })}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  form.submit();
                }}
              >
                <CheckOutlined />
                {intl.formatMessage({ id: 'pages.report.export.confirm' })}
              </Button>
            </Space>
          }
        >
          <Form className="bg-grey" form={form} {...formItemLayout} layout="horizontal">
            <Row>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 17 }}
                  name={['oldpassword']}
                  label={intl.formatMessage({
                    id: 'view.user.old_password',
                  })}
                >
                  <Input.Password
                    maxLength={255}
                    onBlur={(e) => {
                      form.setFieldsValue({
                        oldpassword: e.target.value.trim(),
                      });
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      form.setFieldsValue({
                        oldpassword: e.clipboardData.getData('text').trim(),
                      });
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 17 }}
                  name={['newpassword']}
                  label={intl.formatMessage({
                    id: 'view.user.new_password',
                  })}
                >
                  <Input.Password
                    maxLength={255}
                    onBlur={(e) => {
                      form.setFieldsValue({
                        newpassword: e.target.value.trim(),
                      });
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      form.setFieldsValue({
                        newpassword: e.clipboardData.getData('text').trim(),
                      });
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 17 }}
                  name={['confirmpassword']}
                  label={intl.formatMessage({
                    id: 'view.user.confirm_password',
                  })}
                >
                  <Input.Password
                    maxLength={255}
                    onBlur={(e) => {
                      form.setFieldsValue({
                        confirmpassword: e.target.value.trim(),
                      });
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      form.setFieldsValue({
                        confirmpassword: e.clipboardData.getData('text').trim(),
                      });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </MSCustomizeDrawer>
      )}
    </>
  );
}
function mapStateToProps(state) {}
export default connect(mapStateToProps)(ChangePassword);
