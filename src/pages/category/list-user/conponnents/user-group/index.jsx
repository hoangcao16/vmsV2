import MSCustomizeDrawer from '@/components/Drawer';
import permissionCheck from '@/utils/PermissionCheck';
import TableUtils from '@/utils/TableHelper';
import { EditableProTable } from '@ant-design/pro-table';
import { Button, Space } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import AddUserGroup from './AddEditUserGroup';
function UserGroup({ dispatch, list, metadata, loading }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [showDrawerAdd, setOpenDrawerAdd] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const intl = useIntl();

  useEffect(() => {
    dispatch({
      type: 'userGroup/fetchAllUserGroup',
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

  const showDrawerAddUserGroup = (record) => {
    setOpenDrawerAdd(true);
    setSelectedRecord(record);
  };
  const closeDrawerAddUserGroup = () => {
    setOpenDrawerAdd(false);
    setSelectedRecord(null);
  };

  const columns = [
    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.name',
      }),
      dataIndex: 'name',
      ...TableUtils.getColumnSearchProps('name'),
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
      type: 'userGroup/fetchAllUserGroup',
      payload: {
        page,
        size,
      },
    });
  };
  const handleDeleteUserGroup = (uuid) => {
    dispatch({
      type: 'userGroup/remove',
      payload: uuid,
    });

    setOpenDrawerAdd(false);
  };

  return (
    <>
      <Space>
        <Button type="primary" onClick={showDrawer}>
          {intl.formatMessage({
            id: 'pages.setting-user.list-user.group-user',
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
            id: 'pages.setting-user.list-user.group-user-list',
          })}
          placement="right"
        >
          <>
            <EditableProTable
              loading={loading}
              headerTitle={intl.formatMessage({
                id: 'pages.setting-user.list-user.group-user-list',
              })}
              rowKey="uuid"
              search={false}
              value={list}
              columns={columns}
              // rowSelection={{}}

              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    event.stopPropagation();
                    permissionCheck('delete_user_group') && showDrawerAddUserGroup(record);
                  },
                };
              }}
              recordCreatorProps={{
                creatorButtonText: intl.formatMessage({
                  id: 'pages.setting-user.list-user.add-user-group',
                }),
                onClick: () => showDrawerAddUserGroup(null),
              }}
              options={false}
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
              <AddUserGroup
                onClose={closeDrawerAddUserGroup}
                openDrawer={showDrawerAdd}
                selectedRecord={selectedRecord}
                handleDeleteUserGroup={handleDeleteUserGroup}
              />
            )}
          </>
        </MSCustomizeDrawer>
      )}
    </>
  );
}

function mapStateToProps(state) {
  const { list, metadata } = state.userGroup;
  return {
    loading: state.loading.models.userGroup,
    list,
    metadata,
  };
}

export default connect(mapStateToProps)(UserGroup);
