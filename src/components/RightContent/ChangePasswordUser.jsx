import MSCustomizeDrawer from '@/components/Drawer';
import { notify } from '@/components/Notify';
import ChangePass from '@/services/changepassword/ChangePasswordAPI';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Space } from 'antd';
import { connect } from 'dva';
import { reactLocalStorage } from 'reactjs-localstorage';
import { useIntl } from 'umi';
function ChangePassword({ openDrawer, onClose }) {
  const intl = useIntl();
  const [form] = Form.useForm();
  const formItemLayout = {
    wrapperCol: { span: 24 },
    labelCol: { span: 10 },
  };

  const changePass = () => {
    let user = reactLocalStorage.getObject('user_permissions', null);
    const params = {
      password: form.getFieldValue('oldpassword'),
      new_password: form.getFieldValue('newpassword'),
      confirm_new_password: form.getFieldValue('confirmpassword'),
    };

    ChangePass.changePass(user?.user_uuid, params)
      .then((rs) => {
        if (rs.code === 600) {
          notify('success', 'noti.success', 'noti.change_password');
        }
        if (rs.code === 601 && params.new_password !== undefined) {
          notify('error', 'noti.faid', 'noti.fail.change_password');
        }
        if ((rs.code === 601 && params.new_password === undefined) || params.new_password === '') {
          notify('error', 'noti.faid', 'noti.fail.change_pass');
        }
      })
      .catch((error) => {
        console.log('error:', error);
      });
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
              <Button type="primary" htmlType="submit" onClick={changePass}>
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
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name={['oldpassword']}
                  label={intl.formatMessage({
                    id: 'view.user.old_password',
                  })}
                  rules={[
                    {
                      min: 4,
                      message: `${intl.formatMessage({
                        id: 'view.user.detail_list.pass_length',
                      })}`,
                    },
                  ]}
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
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name={['newpassword']}
                  label={intl.formatMessage({
                    id: 'view.user.new_password',
                  })}
                  rules={[
                    {
                      min: 4,
                      message: `${intl.formatMessage({
                        id: 'view.user.detail_list.pass_length',
                      })}`,
                    },
                  ]}
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
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name={['confirmpassword']}
                  label={intl.formatMessage({
                    id: 'view.user.confirm_password',
                  })}
                  rules={[
                    {
                      min: 4,
                      message: `${intl.formatMessage({
                        id: 'view.user.detail_list.pass_length',
                      })}`,
                    },
                  ]}
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
