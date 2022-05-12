import MSCustomizeDrawer from '@/components/Drawer';
import permissionCheck from '@/utils/PermissionCheck';
import { EditOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, Space, Tooltip } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import AddUserGroup from './AddEditUserGroup';
function UserGroup({ dispatch, list, metadata }) {
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
              {permissionCheck('edit_user_group') && (
                <Tooltip
                  placement="top"
                  title={intl.formatMessage({
                    id: 'pages.setting-user.list-user.edit',
                  })}
                  arrowPointAtCenter={true}
                >
                  <EditOutlined onClick={() => showDrawerAddUserGroup(record)} />
                </Tooltip>
              )}
            </Space>
            <Space>
              {permissionCheck('delete_user_group') && (
                <Tooltip
                  placement="top"
                  title={intl.formatMessage({
                    id: 'pages.setting-user.list-user.delete',
                  })}
                  arrowPointAtCenter={true}
                >
                  {/* <DeleteOutlined onClick={() => handleDeleteUserGroup(record.uuid)} /> */}
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
      type: 'userGroup/fetchAllUserGroup',
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
            <ProTable
              // loading={loading}
              headerTitle={intl.formatMessage({
                id: 'pages.setting-user.list-user.group-user-list',
              })}
              rowKey="id"
              search={false}
              dataSource={list}
              columns={columns}
              rowSelection={{}}
              options={false}
              toolbar={{
                multipleLine: true,
                // filter: (
                //   <LightFilter>
                //     <Search placeholder="Tìm kiếm theo tên nhóm người dùng" />
                //   </LightFilter>
                // ),
                actions: [
                  <Button
                    key="add-user"
                    type="primary"
                    onClick={() => showDrawerAddUserGroup(null)}
                  >
                    {intl.formatMessage({
                      id: 'pages.setting-user.list-user.add-group-user',
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
              <AddUserGroup
                onClose={closeDrawerAddUserGroup}
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
  const { list, metadata } = state.userGroup;
  return {
    loading: state.loading.models.userGroup,
    list,
    metadata,
  };
}

export default connect(mapStateToProps)(UserGroup);
