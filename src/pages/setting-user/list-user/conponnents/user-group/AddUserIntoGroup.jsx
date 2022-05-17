import MSCustomizeDrawer from '@/components/Drawer';
import { STORAGE } from '@/constants/common';
import TableUtils from '@/utils/TableHelper';
import ProTable from '@ant-design/pro-table';
import { Button, Space } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
function AddUserIntoGroup({ dispatch, listUserNoIntoGroup, listUuidCurrentUserInGroup }) {
  const [openDrawer, setOpenDrawer] = useState(false);

  const intl = useIntl();

  useEffect(() => {
    dispatch({
      type: 'userInGroup/fetchAllUserNotInGroup',
      payload: {
        page: 1,
        size: 1000000,
      },
    });
  }, []);

  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onClose = () => {
    setOpenDrawer(false);
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
      title: 'Email',
      dataIndex: 'email',
      // ...TableUtils.getColumnSearchProps('email'),
      search: true,
    },

    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.phone',
      }),
      dataIndex: 'phone',
    },
  ];

  const onPaginationChange = (page, size) => {};
  const handleAddUserIntoGroup = ({ selectedRowKeys }) => {
    const dataAddMem = {
      user_uuids: [...listUuidCurrentUserInGroup, ...selectedRowKeys],
      group_uuid: localStorage.getItem(STORAGE.GROUP_UUID_SELECTED),
    };

    dispatch({
      type: 'userInGroup/addMemberIntoGroups',
      payload: dataAddMem,
    });

    onClose();
  };

  return (
    <>
      <Space>
        <Button type="primary" onClick={showDrawer}>
          {intl.formatMessage({
            id: 'pages.setting-user.list-user.add-user-in-group',
          })}
        </Button>
      </Space>
      {openDrawer && (
        <MSCustomizeDrawer
          openDrawer={openDrawer}
          onClose={onClose}
          width={'50%'}
          zIndex={1003}
          title={intl.formatMessage({
            id: 'pages.setting-user.list-user.list',
          })}
          placement="right"
        >
          <>
            <ProTable
              headerTitle={intl.formatMessage({
                id: 'pages.setting-user.list-user.list',
              })}
              rowKey="uuid"
              search={false}
              dataSource={listUserNoIntoGroup}
              columns={columns}
              rowSelection={{}}
              tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
                <Space size={24}>
                  <span>
                    {intl.formatMessage({
                      id: 'pages.setting-user.list-user.select',
                    })}{' '}
                    {selectedRowKeys.length}{' '}
                    {intl.formatMessage({
                      id: 'pages.setting-user.list-user.record',
                    })}
                    <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                      {intl.formatMessage({
                        id: 'pages.setting-user.list-user.clean',
                      })}
                    </a>
                  </span>
                </Space>
              )}
              tableAlertOptionRender={(selectedRowKeys) => {
                return (
                  <Space size={16}>
                    <Button type="primary" onClick={() => handleAddUserIntoGroup(selectedRowKeys)}>
                      {intl.formatMessage({
                        id: 'pages.setting-user.list-user.add',
                      })}
                    </Button>
                  </Space>
                );
              }}
              options={false}
              pagination={{
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: (total) =>
                  `${intl.formatMessage({
                    id: 'pages.setting-user.list-user.total',
                  })} ${total}`,
                total: listUserNoIntoGroup?.length,
                onChange: onPaginationChange,
                pageSize: 5,
                current: 1,
              }}
            />
          </>
        </MSCustomizeDrawer>
      )}
    </>
  );
}

function mapStateToProps(state) {
  const { listUserNoIntoGroup, metadata, list } = state.userInGroup;
  return {
    loading: state.loading.models.userInGroup,
    listUserNoIntoGroup,
    metadata,
    listUuidCurrentUserInGroup: list?.map((l) => l.uuid),
  };
}

export default connect(mapStateToProps)(AddUserIntoGroup);
