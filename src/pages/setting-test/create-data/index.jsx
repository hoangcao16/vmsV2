import MSCustomizeDrawer from '@/components/CustomizeComponent/Drawer/DrawerCustomize';
import MSItemInForm from '@/components/CustomizeComponent/Form/Item';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Col, Form, Input, Row, Space } from 'antd';
import React, { useState } from 'react';
export default function CreateData() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [form] = Form.useForm();
  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onClose = () => {
    setOpenDrawer(false);
  };

  const handleSubmit = () => {
    const a = form.getFieldsValue(true);
    console.log('a:', a);

    return false;
  };
  return (
    <PageContainer>
      <Space>
        <Button type="primary" onClick={showDrawer}>
          Open
        </Button>
      </Space>
      {openDrawer && (
        <MSCustomizeDrawer
          openDrawer={openDrawer}
          onClose={onClose}
          width={800}
          zIndex={1001}
          title="Test"
          placement="right"
          extra={
            <Space>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="primary" onClick={onClose}>
                OK
              </Button>
            </Space>
          }
        >
          <div>
            <Form layout="vertical" form={form} onFinish={handleSubmit}>
              <Row gutter={16}>
                <Col span={24}>
                  <MSItemInForm
                    label="Username"
                    type="input"
                    name="name"
                    minLength={5}
                    maxLength={255}
                    required={true}
                  >
                    <Input />
                  </MSItemInForm>
                </Col>
              </Row>
            </Form>
            <div
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e9e9e9',
                padding: '10px 16px',
                background: '#fff',
                textAlign: 'right',
              }}
            >
              <Button type="danger">Hủy</Button>
              <Button htmlType="submit" onClick={handleSubmit} type="ghost">
                Sửa
              </Button>
            </div>
          </div>
        </MSCustomizeDrawer>
      )}
    </PageContainer>
  );
}
