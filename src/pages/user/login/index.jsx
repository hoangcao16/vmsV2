import Footer from '@/components/Footer';
import AuthZApi from '@/services/authz/AuthZApi';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { message, Tabs } from 'antd';
import React, { useState } from 'react';
import { FormattedMessage, history, SelectLang, useIntl, useModel } from 'umi';
import styles from './index.less';
import { BottomForm } from './style';

const Login = () => {
  const [userLoginState, setUserLoginState] = useState({});
  const [type, setType] = useState('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  console.log('type:', type);
  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  const handleSubmit = async (values) => {
    try {
      const msg = await AuthZApi.login({ ...values, type });

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
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.svg" />}
          title={intl.formatMessage({
            id: 'pages.layouts.userLayout.header',
          })}
          subTitle={intl.formatMessage({
            id: 'pages.layouts.userLayout.title',
          })}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="account"
              tab={intl.formatMessage({
                id: 'pages.login.accountLogin.tab',
              })}
            />
            <Tabs.TabPane
              key="forgotPassword"
              tab={intl.formatMessage({
                id: 'pages.login.accountLogin.forgotPassword',
              })}
            />
          </Tabs>

          {type === 'account' && (
            <>
              <ProFormText
                name="email"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.email.placeholder',
                })}
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="pages.login.email.required" />,
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                })}
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="pages.login.password.required" />,
                  },
                ]}
              />
            </>
          )}

          {type === 'forgotPassword' && (
            <ProFormText
              name="email"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.email.placeholder',
              })}
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id="pages.login.email.required" />,
                },
              ]}
            />
          )}

          {type === 'account' ? (
            <BottomForm>
              <ProFormCheckbox noStyle name="autoLogin">
                <FormattedMessage id="pages.login.rememberMe" />
              </ProFormCheckbox>
              <a className="forgot-password">
                <FormattedMessage id="pages.login.forgotPassword" />
              </a>
            </BottomForm>
          ) : (
            <BottomForm>
              <a className="forgot-password">
                <FormattedMessage id="pages.login.accountLogin.tab" />
              </a>
            </BottomForm>
          )}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
