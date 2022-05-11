import { STORAGE } from '@/constants/common';
import AuthZApi from '@/services/authz/AuthZApi';
import { LogoutOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React, { useCallback } from 'react';
import { history, useModel } from 'umi';
import HeaderDropdown from '../Header/HeaderDropdown';
import styles from './index.less';




const AvatarDropdown = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');
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

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="logout">
        <LogoutOutlined />
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size="small"
          className={styles.avatar}
          src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'"
          alt="avatar"
        />
        <span className={`${styles.name} anticon`}>Thường</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
