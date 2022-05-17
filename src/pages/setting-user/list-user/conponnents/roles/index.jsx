import MSCustomizeDrawer from '@/components/Drawer';
import permissionCheck from '@/utils/PermissionCheck';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm, Space, Tooltip } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import AddEditUserRole from './AddEditUserRole';
function UserRole({ dispatch, list, metadata }) {
  const intl = useIntl();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [showDrawerAdd, setOpenDrawerAdd] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    dispatch({
      type: 'userRole/fetchAllUserRole',
      payload: {
        filter: '',
        page: metadata?.page,
        size: metadata?.size,
      },
    });
  }, []);

  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onClose = () => {
    setOpenDrawer(false);
  };

  const showDrawerAddUserRole = (record) => {
    setOpenDrawerAdd(true);
    setSelectedRecord(record);
  };
  const closeDrawerAddRole = () => {
    setOpenDrawerAdd(false);
    setSelectedRecord(null);
  };

  const handleDeleteRole = (id) => {
    dispatch({
      type: 'userRole/remove',
      payload: id,
    });
  };

  const columns = [
    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.name',
      }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.description',
      }),
      dataIndex: 'description',
    },

    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.option',
      }),
      dataIndex: 'option',
      valueType: 'option',
      render: (text, record) => {
        return (
          <>
            <Space>
              {permissionCheck('edit_role') && (
                <Tooltip
                  placement="top"
                  title={intl.formatMessage({
                    id: 'pages.setting-user.list-user.edit',
                  })}
                  arrowPointAtCenter={true}
                >
                  <EditOutlined onClick={() => showDrawerAddUserRole(record)} />
                </Tooltip>
              )}
            </Space>
            <Space>
              {permissionCheck('delete_role') && (
                <Popconfirm
                  title={intl.formatMessage({
                    id: 'pages.setting-user.list-user.delete-confirm',
                  })}
                  onConfirm={() => handleDeleteRole(record.uuid)}
                  cancelText="Cancel"
                  okText="Ok"
                >
                  <Tooltip
                    placement="top"
                    title={intl.formatMessage({
                      id: 'pages.setting-user.list-user.delete',
                    })}
                    arrowPointAtCenter={true}
                  >
                    <DeleteOutlined />
                  </Tooltip>
                </Popconfirm>
              )}
            </Space>
          </>
        );
      },
    },
  ];

  const onPaginationChange = (page, size) => {
    dispatch({
      type: 'userRole/fetchAllUserRole',
      payload: {
        page,
        size,
      },
    });
  };

  return (
    <>
      <Space>
        <Button type="primary" onClick={showDrawer}>
          {intl.formatMessage({
            id: 'pages.setting-user.list-user.role',
          })}
        </Button>
      </Space>
      {openDrawer && (
        <MSCustomizeDrawer
          openDrawer={openDrawer}
          onClose={onClose}
          width={'80%'}
          zIndex={1001}
          title={intl.formatMessage({
            id: 'pages.setting-user.list-user.list-role',
          })}
          placement="right"
        >
          <>
            <ProTable
              // loading={loading}
              headerTitle={intl.formatMessage({
                id: 'pages.setting-user.list-user.list-role',
              })}
              rowKey="id"
              search={false}
              dataSource={list}
              columns={columns}
              options={false}
              toolbar={{
                multipleLine: true,
                // filter: (
                //   <LightFilter>
                //     <Search placeholder="Tìm kiếm theo tên vai trò" />
                //   </LightFilter>
                // ),
                actions: [
                  <Button key="add-role" type="primary" onClick={() => showDrawerAddUserRole(null)}>
                    {intl.formatMessage({
                      id: 'pages.setting-user.list-user.add-role',
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
                  })} ${total}`,
                total: metadata?.total,
                onChange: onPaginationChange,
                pageSize: metadata?.size,
                current: metadata?.page,
              }}
            />
            {showDrawerAdd && (
              <AddEditUserRole
                onClose={closeDrawerAddRole}
                openDrawer={showDrawerAdd}
                selectedRecord={selectedRecord}
              />
            )}
          </>
        </MSCustomizeDrawer>
      )}
    </>
  );
}

function mapStateToProps(state) {
  const { list, metadata } = state.userRole;
  return {
    loading: state.loading.models.userRole,
    list,
    metadata,
  };
}

export default connect(mapStateToProps)(UserRole);
