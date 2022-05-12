import MSCustomizeDrawer from '@/components/Drawer';
import { Button, Form } from 'antd';
import React, { useState } from 'react';

export default function AddUserGroup() {
  const [openDrawer1, setOpenDrawer] = useState(false);
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
        Thêm nhóm người dùng
      </Button>
      <MSCustomizeDrawer
        openDrawer={openDrawer1}
        onClose={onClose}
        width={'50%'}
        zIndex={1002}
        title="Thêm nhóm người dùng"
        placement="right"
      >
        <div>
          <h1>Helooo</h1>
        </div>
      </MSCustomizeDrawer>
    </div>
  );
}
