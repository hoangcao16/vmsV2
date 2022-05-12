import MSCustomizeDrawer from '@/components/Drawer';
import { Button, Form } from 'antd';
import React, { useState } from 'react';

export default function AddUserRole() {
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
        Thêm vai trò
      </Button>
      <MSCustomizeDrawer
        openDrawer={openDrawer1}
        onClose={onClose}
        width={'50%'}
        zIndex={1002}
        title="Thêm vai trò"
        placement="right"
      >
        <div>
          <h1>Helooo</h1>
        </div>
      </MSCustomizeDrawer>
    </div>
  );
}
