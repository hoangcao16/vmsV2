import MSCustomizeDrawer from '@/components/Drawer';
import MSFormItem from '@/components/Form/Item';
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, Col, Form, Input, Row, Space, Tag, Tooltip } from 'antd';
import { connect } from 'dva';
import { useState } from 'react';

const TableZone = ({ dispatch, list, metadata }) => {
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

    return false;
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Tên NVR',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Địa điểm',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Thao tác',
      render: (text, record) => {
        return (
          <Space>
            <Tooltip placement="top" title="Chi tiết">
              <InfoCircleOutlined style={{ fontSize: '16px', color: '#6E6B7B' }} />
            </Tooltip>
            <Tooltip placement="top" title="Chỉnh sửa">
              <EditOutlined style={{ fontSize: '16px', color: '#6E6B7B' }} />
            </Tooltip>
            <Tooltip placement="top" title="Xóa">
              <DeleteOutlined style={{ fontSize: '16px', color: '#6E6B7B' }} />
            </Tooltip>
          </Space>
        );
      },
    },
  ];
  return (
    <>
      <ProTable
        headerTitle="Danh sách Zone"
        rowKey="id"
        search={false}
        dataSource={list}
        columns={columns}
        options={false}
        toolbar={{
          multipleLine: true,
          search: {
            onSearch: (value) => {
              alert(value);
            },
          },
          actions: [
            <Button
              key="add"
              type="primary"
              onClick={() => {
                alert('add');
              }}
            >
              <PlusOutlined />
              Thêm zone
            </Button>,
          ],
        }}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) => `Tổng cộng ${total} Zone`,
          total: metadata?.total,
          pageSize: metadata?.size,
          current: metadata?.page,
        }}
      />
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
                  <MSFormItem
                    label="Username"
                    type="input"
                    name="name"
                    minLength={5}
                    maxLength={255}
                    required={true}
                  >
                    <Input />
                  </MSFormItem>
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
    </>
  );
};

function mapStateToProps(state) {
  const { list, metadata } = state.zone;
  return {
    loading: state.loading.models.zone,
    list,
    metadata,
  };
}
export default connect(mapStateToProps)(TableZone);
