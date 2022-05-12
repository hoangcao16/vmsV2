import MSCustomizeDrawer from '@/components/Drawer';
import { Button, Form } from 'antd';
import React, { useState } from 'react';
import { useIntl } from 'umi';
export default function AddUserRole() {
  const intl = useIntl();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [form] = Form.useForm();

  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onClose = () => {
    setOpenDrawer(false);
  };
  return (
    <div>
      <Button type="primary" onClick={showDrawer}>
        {intl.formatMessage({
          id: 'pages.setting-user.list-user.add-role',
        })}
      </Button>
      <MSCustomizeDrawer
        openDrawer={openDrawer}
        onClose={onClose}
        width={'50%'}
        zIndex={1002}
        title={intl.formatMessage({
          id: 'pages.setting-user.list-user.add-role',
        })}
        placement="right"
      >
        <div>
          <h1>Helooo</h1>
        </div>
      </MSCustomizeDrawer>
    </div>
  );
}
