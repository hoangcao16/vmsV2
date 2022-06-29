import { STORAGE } from '@/constants/common';
import ChangePassword from '@/components/RightContent/ChangePasswordUser';
import AuthZApi from '@/services/authz/AuthZApi';

import { LogoutOutlined, EditOutlined } from '@ant-design/icons';

import { Avatar, Menu, Popconfirm, Spin, Form } from 'antd';
import React, { useCallback, useState } from 'react';
import { history, useIntl, useModel } from 'umi';
import HeaderDropdown from '../Header/HeaderDropdown';
import styles from './index.less';

const AvatarDropdown = ({ menu }) => {
  const intl = useIntl();
  const { initialState, setInitialState } = useModel('@@initialState');
  const [openDrawer, setOpenDrawer] = useState(false);

  const [form] = Form.useForm();
  const showDrawer = () => {
    setOpenDrawer(true);
    console.log('openDrawer:', openDrawer);
  };
  const onClose = () => {
    setOpenDrawer(false);
    console.log('openDrawer:', openDrawer);
  };

  const onMenuClick = useCallback(
    async (event) => {
      const { key } = event;

      if (key === 'logout') {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
        await AuthZApi.logout();
        localStorage.setItem(STORAGE.TOKEN, null);
        localStorage.setItem(STORAGE.USER_PERMISSIONS, null);
        const loginPath = '/user/login';
        history.push(loginPath);
        return;
      }
      if (key === 'changepassword') {
        return;
      }

      if (key === 'changepassword') {
        // history.push('account/changepassword');
        return (
          <>
            <Popconfirm>AA</Popconfirm>
          </>
        );
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser) {
    return loading;
  }
  const formItemLayout = {
    wrapperCol: { span: 24 },
    labelCol: { span: 10 },
  };

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="logout">
        <LogoutOutlined />
        {intl.formatMessage({
          id: 'view.user.log_out',
        })}
      </Menu.Item>
      <Menu.Item key="changepassword">
        <div onClick={showDrawer}>
          <EditOutlined />
          {intl.formatMessage({
            id: 'view.user.change_password',
          })}
        </div>

        {openDrawer && <ChangePassword onClose={onClose} openDrawer={openDrawer} />}
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size="small"
          className={styles.avatar}
          src={currentUser?.payload?.user_avatar}
          alt="avatar"
        />
        <span className={`${styles.name} anticon`}>{currentUser?.payload?.user_name}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
