import MSCustomizeDrawer from '@/components/Drawer';
import { notify } from '@/components/Notify';
import ResetPassword from '@/services/resetPassword/ResetPasswordAPI';
import { CloseOutlined, RedoOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import { connect } from 'dva';
import { FormattedMessage, useIntl } from 'umi';
import { CardNote, CardTitle } from './style';

function ForgotPassword({ openDrawer, onClose }) {
  const intl = useIntl();
  const [form] = Form.useForm();

  const reset = () => {
    const params = {
      email: form.getFieldValue('emailresetpass'),
    };

    ResetPassword.resetPassword(params)
      .then((rs) => {
        if (rs.code === 600) {
          form.resetFields(['emailresetpass']);
          notify('success', 'noti.success', 'noti.have_sent_email');
        }
        if (rs.code === 608) {
          notify('error', 'noti.faid', 'pages.setting-user.list-user.608');
        }
        if (rs.code === 601) {
          notify('error', 'noti.faid', 'view.user.detail_list.email_address_required');
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
          width={'25%'}
          zIndex={1001}
          placement="right"
          extra={
            <Space>
              <Button type="primary" htmlType="submit" onClick={reset}>
                <RedoOutlined />
                {intl.formatMessage({ id: 'view.pages.recover_pw' })}
              </Button>
              <Button onClick={onClose}>
                <CloseOutlined />
                {intl.formatMessage({ id: 'view.map.cancel' })}
              </Button>
            </Space>
          }
        >
          <CardTitle>
            {intl.formatMessage({
              id: `pages.login.forgotPassword`,
            })}
          </CardTitle>
          <CardNote>
            <FormattedMessage id="view.page.note.recover_password" />
          </CardNote>

          <Form className="bg-grey" form={form} layout="vertical">
            <Form.Item name={['emailresetpass']}>
              <Input
                maxLength={255}
                onBlur={(e) => {
                  form.setFieldsValue({
                    emailresetpass: e.target.value.trim(),
                  });
                }}
                placeholder={intl.formatMessage({
                  id: 'view.pages.email',
                })}
                onPaste={(e) => {
                  e.preventDefault();
                  form.setFieldsValue({
                    emailresetpass: e.clipboardData.getData('text').trim(),
                  });
                }}
              />
            </Form.Item>
          </Form>
        </MSCustomizeDrawer>
      )}
    </>
  );
}
function mapStateToProps(state) {}
export default connect(mapStateToProps)(ForgotPassword);
