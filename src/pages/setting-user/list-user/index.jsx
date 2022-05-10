// import MSCustomizeDrawer from '@/components/CustomizeComponent/Drawer/DrawerCustomize';
// import MSItemInForm from '@/components/CustomizeComponent/Form/Item';
// import { PageContainer } from '@ant-design/pro-layout';
// import { Button, Col, Form, Input, Row, Space } from 'antd';
// import React, { useState } from 'react';
// import styles from './styles.less';
// export default function CreateData() {
//   const [openDrawer, setOpenDrawer] = useState(false);
//   const [form] = Form.useForm();
//   const showDrawer = () => {
//     setOpenDrawer(true);
//   };
//   const onClose = () => {
//     setOpenDrawer(false);
//   };

//   const handleSubmit = () => {
//     const a = form.getFieldsValue(true);
//     console.log('a:', a);

//     return false;
//   };
//   return (
//     <PageContainer>
//       <Space>
//         <Button type="primary" onClick={showDrawer}>
//           Open
//         </Button>
//       </Space>
//       {openDrawer && (
//         <MSCustomizeDrawer
//           openDrawer={openDrawer}
//           onClose={onClose}
//           width={800}
//           zIndex={1001}
//           title="Test"
//           placement="right"
//           extra={
//             <Space>
//               <Button onClick={onClose}>Cancel</Button>
//               <Button type="primary" onClick={onClose}>
//                 OK
//               </Button>
//             </Space>
//           }
//         >
//           <div>
//             <Form layout="vertical" form={form} onFinish={handleSubmit}>
//               <Row gutter={16}>
//                 <Col span={24}>
//                   <MSItemInForm
//                     label="Username"
//                     type="input"
//                     name="name"
//                     minLength={5}
//                     maxLength={255}
//                     required={true}
//                   >
//                     <Input />
//                   </MSItemInForm>
//                 </Col>
//               </Row>
//             </Form>
//             <div
//               style={{
//                 position: 'absolute',
//                 right: 0,
//                 bottom: 0,
//                 width: '100%',
//                 borderTop: '1px solid #e9e9e9',
//                 padding: '10px 16px',
//                 background: '#fff',
//                 textAlign: 'right',
//               }}
//             >
//               <Button className={styles.deleteButton} type="danger">
//                 Hủy
//               </Button>
//               <Button htmlType="submit" onClick={handleSubmit} type="ghost">
//                 Sửa
//               </Button>
//             </div>
//           </div>
//         </MSCustomizeDrawer>
//       )}
//     </PageContainer>
//   );
// }

import MSCustomizeDrawer from '@/components/CustomizeComponent/Drawer/DrawerCustomize';
import MSItemInForm from '@/components/CustomizeComponent/Form/Item';
import Menu from '@/locales/en-US/menu';
import permissionCheck from '@/utils/PermissionCheck';
import {
  ArrowDownOutlined,
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  EllipsisOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { LightFilter } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Dropdown, Input, Select, Space, Switch, Tooltip, Form, Row, Col } from 'antd';
import { connect } from 'dva';
import { useState } from 'react';
import styles from './styles.less';
const { Option } = Select;
const { Search } = Input;
const UserList = ({ dispatch, list, metadata }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (text, record) => {
        return (
          <Space>
            <Tooltip placement="top" title="Trạng thái">
              <Switch
                defaultChecked={record.status === 1 ? true : false}
                // onChange={(e) => handleUpdateStatus(e, record.uuid)}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                disabled={!permissionCheck('deactivate_user')}
              />
            </Tooltip>
          </Space>
        );
      },
    },

    {
      title: 'Thao tác',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <>
          <EyeOutlined />
          <EnvironmentOutlined />
          <EditOutlined />
        </>,
      ],
    },
  ];
  const onPaginationChange = (page, size) => {
    dispatch({
      type: 'user/fetchAllUser',
      payload: {
        page,
        size,
      },
    });
  };

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (val) => {
    console.log('search:', val);
  };

  const handlaExpand = (e) => {
    setVisible(!visible);
  };

  const handleSubmit = () => {
    const a = form.getFieldsValue(true);
    console.log('a:', a);
  };
  const formItemLayout = {
    wrapperCol: { span: 24 },
    labelCol: { span: 24 },
  };

  const renderFilter = () => {
    return (
      <>
        <Form layout="horizontal" form={form} onFinish={handleSubmit} {...formItemLayout}>
          <Row gutter={16} span={24} className={styles.expandRow}>
            <Col span={18}>
              <MSItemInForm type="input" name="name" minLength={5} maxLength={255} required={true}>
                <Search />
              </MSItemInForm>
            </Col>
            <Col span={6}>
              <h4 onClick={handlaExpand}>{visible ? 'Ẩn bộ lọc' : 'Thêm bộ lọc'}</h4>
            </Col>
          </Row>

          {visible && (
            <div className={styles.formExpand}>
              <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                  <MSItemInForm label="Chức vụ" type="input" name="test">
                    <Select />
                  </MSItemInForm>
                </Col>
                <Col className="gutter-row" span={12}>
                  <MSItemInForm label="Vai trò" type="input" name="test1">
                    <Select />
                  </MSItemInForm>
                </Col>
                <Col className="gutter-row" span={12}>
                  <MSItemInForm label="Đơn vị" type="input" name="test2">
                    <Select />
                  </MSItemInForm>
                </Col>
                <Col className="gutter-row" span={12}>
                  <MSItemInForm label="Nhóm người dùng" type="input" name="test3">
                    <Select />
                  </MSItemInForm>
                </Col>
              </Row>
            </div>
          )}
        </Form>
      </>
    );
  };

  return (
    <PageContainer>
      <ProTable
        headerTitle="Danh sách user"
        rowKey="id"
        search={false}
        dataSource={list}
        columns={columns}
        rowSelection={{}}
        options={false}
        toolbar={{
          multipleLine: true,
          filter: <LightFilter wrapperCol={24}>{renderFilter()}</LightFilter>,
          actions: [
            <Button
              key="add"
              type="primary"
              onClick={() => {
                alert('add');
              }}
            >
              <PlusOutlined />
              Thêm camera
            </Button>,
          ],
          style: { width: '100%' },
        }}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) => `Tổng cộng ${total} user`,
          total: metadata?.total,
          onChange: onPaginationChange,
          pageSize: metadata?.size,
          current: metadata?.page,
        }}
      />
    </PageContainer>
  );
};
function mapStateToProps(state) {
  const { list, metadata } = state.user;
  return {
    loading: state.loading.models.user,
    list,
    metadata,
  };
}

export default connect(mapStateToProps)(UserList);
