import Footer from '@/components/Footer';
import AuthZApi from '@/services/authz/AuthZApi';
import { GlobalOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox } from '@ant-design/pro-form';
import { Form, Input, message, Tabs, Button } from 'antd';
import { useState } from 'react';
import { FormattedMessage, history, SelectLang, useIntl, useModel } from 'umi';
import ForgotPassword from './ForgotPassword';
import styles from './index.less';
import { BottomForm, StyledImg } from './style';
import styled from 'styled-components';
const Login = () => {
  const [userLoginState, setUserLoginState] = useState({});
  const [type, setType] = useState('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const [openDrawer, setOpenDrawer] = useState(false);
  const intl = useIntl();
  const [form] = Form.useForm();

  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onClose = () => {
    setOpenDrawer(false);
  };
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };
  const handleSubmit = async (values) => {
    const data = form.getFieldValue();
    try {
      const msg = await AuthZApi.login({ ...values, ...data, type });

      if (msg.code === 600) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();

        if (!history) return;
        const { query } = history.location;
        const { redirect } = query;
        history.push(redirect || '/');
        return;
      } else {
        const defaultLoginFailureMessage = intl.formatMessage({
          id: 'pages.login.failure',
        });
        message.error(defaultLoginFailureMessage);
      }

      setUserLoginState(msg);
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
      });
      message.error(defaultLoginFailureMessage);
    }
  };

  const { status, type: loginType } = userLoginState;
  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang icon={<GlobalOutlined />} />}
      </div>
      <div className={styles.content}>
        <StyledImg>
          <img alt="logo" src="/logo_white.svg" />
        </StyledImg>
        <StyleContainer>
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="account"
              tab={intl.formatMessage({
                id: 'pages.login.accountLogin.tab',
              })}
            />
          </Tabs>

          {type === 'account' && (
            <Form className="bg-grey" form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item name={['email']}>
                <Input
                  maxLength={255}
                  name="email"
                  prefix={<UserOutlined className={styles.prefixIcon} />}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.email.placeholder',
                  })}
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="pages.login.email.required" />,
                    },
                  ]}
                  onBlur={(e) => {
                    form.setFieldsValue({
                      email: e.target.value.trim(),
                    });
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    form.setFieldsValue({
                      email: e.clipboardData.getData('text').trim(),
                    });
                  }}
                />
              </Form.Item>
              <Form.Item name={['password']}>
                <Input
                  type="password"
                  maxLength={255}
                  name="password"
                  prefix={<LockOutlined className={styles.prefixIcon} />}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.password.placeholder',
                  })}
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="pages.login.password.required" />,
                    },
                  ]}
                  onBlur={(e) => {
                    form.setFieldsValue({
                      password: e.target.value.trim(),
                    });
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    form.setFieldsValue({
                      password: e.clipboardData.getData('text').trim(),
                    });
                  }}
                />
              </Form.Item>
              <BottomForm>
                <ProFormCheckbox noStyle name="autoLogin">
                  <FormattedMessage id="pages.login.rememberMe" />
                </ProFormCheckbox>

                <a className="forgot-password" onClick={showDrawer}>
                  <FormattedMessage id="pages.login.forgotPassword" />
                </a>

                {openDrawer && <ForgotPassword onClose={onClose} openDrawer={openDrawer} />}
              </BottomForm>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {intl.formatMessage({ id: 'view.pages.login' })}
                </Button>
              </Form.Item>
            </Form>
          )}
        </StyleContainer>
      </div>

      <Footer />
    </div>
  );
};
const StyleContainer = styled.div`
  padding: 32px 0;
  max-width: 500px;
  min-width: 328px;
  width: 400px;
  margin: 0 auto;
  .ant-tabs-nav-wrap {
    justify-content: center;
  }
  .ant-btn {
    width: 100%;
  }
  .ant-checkbox-wrapper {
    color: rgba(229, 224, 216, 0.85);
  }
  .ant-tabs-top {
    .ant-tabs-nav {
      &::before {
        border-bottom-color: rgb(62, 65, 65);
      }
    }
  }
  .ant-tabs-tab {
    font-size: 20px;
  }
`;
export default Login;
