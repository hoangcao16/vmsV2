import { STORAGE } from '@/constants/common';
import { SpanCode } from '@/pages/category/camera/style';
import permissionCheck from '@/utils/PermissionCheck';
import {
  CheckOutlined,
  CloseOutlined,
  DownOutlined,
  RightOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Col, Form, Input, Row, Select, Space, Switch, Tooltip } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import UserRole from './conponnents/roles';
import UserGroup from './conponnents/user-group';
import AddEditUser from './conponnents/user/AddEditUser';
import { ContainerFilter } from './style';

const layoutLong = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const UserList = ({ dispatch, list, metadata }) => {
  const intl = useIntl();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [form] = Form.useForm();
  const [collapse, setCollapse] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  useEffect(() => {
    dispatch({
      type: 'user/fetchAllUser',
      payload: {
        page: metadata?.page,
        size: metadata?.size,
      },
    });
  }, []);

  const showDrawer = (record) => {
    setOpenDrawer(true);
    setSelectedRecord(record);
  };
  const onClose = () => {
    setOpenDrawer(false);
    setSelectedRecord(null);
    dispatch({
      type: 'user/removeUserUuid',
    });
    localStorage.removeItem(STORAGE.USER_UUID_SELECTED);
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
    setOpenDrawer(false);
  };

  const columns = [
    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.list',
      }),
      dataIndex: 'name',
      render: (text) => {
        return <SpanCode>{text}</SpanCode>;
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.phone',
      }),
      dataIndex: 'phone',
    },
    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.status',
      }),
      dataIndex: 'status',
      render: (text, record) => {
        return (
          <Space>
            <Tooltip
              placement="top"
              title={intl.formatMessage({
                id: 'pages.setting-user.list-user.status',
              })}
            >
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

  const handleSubmit = () => {
    const a = form.getFieldsValue(true);
  };

  return (
    <PageContainer>
      <ProTable
        // loading={loading}
        headerTitle={intl.formatMessage({
          id: 'pages.setting-user.list-user.list',
        })}
        rowKey="id"
        search={false}
        dataSource={list}
        columns={columns}
        options={false}
        onRow={(record, recordIndex) => {
          return {
            onClick: (event) => {
              if (event.target.nodeName !== 'DIV') {
                permissionCheck('edit_user') && showDrawer(record);
                localStorage.setItem(STORAGE.USER_UUID_SELECTED, record.uuid);
              }
            },
          };
        }}
        toolbar={{
          multipleLine: true,
          filter: (
            <ContainerFilter>
              <Form
                className=""
                name="basic"
                onFinish={handleSubmit}
                autoComplete="off"
                form={form}
              >
                <div className="collapse-filter">
                  <Form.Item name="quickSearch">
                    <Input.Search
                      placeholder="Tìm kiếm theo tên, địa chỉ"
                      maxLength={255}
                      onSearch={() => {
                        form.submit();
                      }}
                    />
                  </Form.Item>

                  {collapse === true && (
                    <Button
                      type="link"
                      onClick={() => {
                        setCollapse(false);
                      }}
                    >
                      {intl.formatMessage({
                        id: 'view.storage.filter',
                      })}{' '}
                      <RightOutlined />
                    </Button>
                  )}

                  {collapse === false && (
                    <Button
                      type="link"
                      onClick={() => {
                        setCollapse(true);
                      }}
                    >
                      {intl.formatMessage({
                        id: 'view.storage.hide_filter',
                      })}{' '}
                      <DownOutlined />
                    </Button>
                  )}
                </div>

                {collapse === false && (
                  <div className="extra-filter">
                    <Row justify="space-between">
                      <Col span={12}>
                        <Form.Item {...layoutLong} label="Chức vụ" name="cameraUuid">
                          <Select />
                        </Form.Item>

                        <Form.Item {...layoutLong} label="Đơn vị" name="cameraGroupUuid">
                          <Select />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...layoutLong} label="Vai trò" name="provinceId">
                          <Select />
                        </Form.Item>
                        <Form.Item {...layoutLong} label="Nhóm người dùng" name="districtId">
                          <Select />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                )}
              </Form>
            </ContainerFilter>
          ),
          actions: [
            <UserRole key="user-role" />,
            <UserGroup key="user-group" />,
            <Button key="add" type="primary" onClick={() => showDrawer(null)}>
              <UserAddOutlined />
              {intl.formatMessage({
                id: 'pages.setting-user.list-user.new-user',
              })}
            </Button>,
          ],
          style: { width: '100%' },
        }}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) =>
            `${intl.formatMessage({
              id: 'pages.setting-user.list-user.total',
            })} ${total} ${intl.formatMessage({
              id: 'pages.setting-user.list-user.user',
            })}`,
          total: metadata?.total,
          onChange: onPaginationChange,
          pageSize: metadata?.size,
          current: metadata?.page,
        }}
      />
      {openDrawer && (
        <AddEditUser
          openDrawer={openDrawer}
          onClose={onClose}
          selectedRecord={selectedRecord}
          handleDeleteUser={handleDeleteUser}
        />
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
