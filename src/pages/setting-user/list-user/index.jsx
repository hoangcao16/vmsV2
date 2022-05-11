import MSCustomizeDrawer from '@/components/CustomizeComponent/Drawer/DrawerCustomize';
import MSItemInForm from '@/components/CustomizeComponent/Form/Item';
import permissionCheck from '@/utils/PermissionCheck';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { LightFilter } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Col, Form, Input, Row, Select, Space, Switch, Tooltip } from 'antd';
import { connect } from 'dva';
import { useState } from 'react';
import AddUserContent from './conponnents/AddUserContent';
import styles from './styles.less';
const { Option } = Select;
const { Search } = Input;
const UserList = ({ dispatch, list, metadata }) => {
  const [visible, setVisible] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [form] = Form.useForm();
  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onClose = () => {
    setOpenDrawer(false);
  };

  const handleUpdateStatus = async (e, uuid) => {
    let status;
    if (e) {
      status = 1;
    } else {
      status = 0;
    }

    dispatch({
      type: 'user/patch',
      payload: { id: uuid, values: { status: status } },
    });
  };

  const handleDeleteUser = async (id) => {
    dispatch({
      type: 'user/remove',
      payload: id,
    });
  };

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
                checked={record.status === 1 ? true : false}
                onChange={(e) => handleUpdateStatus(e, record.uuid)}
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
      render: (text, record) => {
        return (
          <>
            <Space>
              {permissionCheck('edit_user') && (
                <Tooltip placement="top" title="Sửa" arrowPointAtCenter={true}>
                  <EditOutlined />
                </Tooltip>
              )}
            </Space>
            <Space>
              {permissionCheck('delete_user') && (
                <Tooltip placement="top" title="Xóa" arrowPointAtCenter={true}>
                  <DeleteOutlined onClick={() => handleDeleteUser(record.uuid)} />
                </Tooltip>
              )}
            </Space>
          </>
        );
      },
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

  const handlaExpand = (e) => {
    setVisible(!visible);
  };

  const handleSubmit = () => {
    const a = form.getFieldsValue(true);
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
            <Button key="add" type="primary" onClick={showDrawer}>
              <PlusOutlined />
              Thêm người dùng
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
      {openDrawer && (
        <MSCustomizeDrawer
          openDrawer={openDrawer}
          onClose={onClose}
          width={350}
          zIndex={1001}
          title="Thêm người dùng mới"
          placement="right"
        >
          <AddUserContent onClose={onClose} />
        </MSCustomizeDrawer>
      )}
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
