import MSCustomizeDrawer from '@/components/Drawer';
import permissionCheck from '@/utils/PermissionCheck';
import { EditableProTable } from '@ant-design/pro-table';
import { Button, Space } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import AddEditUserRole from './AddEditUserRole';
function UserRole({ dispatch, list, metadata, loading }) {
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

    setOpenDrawerAdd(false);
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
            <EditableProTable
              loading={loading}
              headerTitle={intl.formatMessage({
                id: 'pages.setting-user.list-user.list-role',
              })}
              rowKey="uuid"
              search={false}
              value={list}
              columns={columns}
              options={false}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    event.stopPropagation();
                    permissionCheck('delete_role') && showDrawerAddUserRole(record);
                  },
                };
              }}
              recordCreatorProps={{
                creatorButtonText: intl.formatMessage({
                  id: 'pages.setting-user.list-user.add-role',
                }),
                onClick: () => showDrawerAddUserRole(null),
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
                handleDeleteRole={handleDeleteRole}
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
