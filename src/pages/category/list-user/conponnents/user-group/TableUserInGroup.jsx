import { STORAGE } from '@/constants/common';
import UserApi from '@/services/user/UserApi';
import permissionCheck from '@/utils/PermissionCheck';
import { CloseOutlined } from '@ant-design/icons';
import { EditableProTable } from '@ant-design/pro-table';
import { Popconfirm, Space, Tag, Tooltip } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import AddUserIntoGroup from './AddUserIntoGroup';

function TableUserInGroup({ id, dispatch, list, loading }) {
  const [showDrawerAdd, setOpenDrawerAdd] = useState(false);

  const intl = useIntl();
  useEffect(() => {
    UserApi.getUserGroupById(id).then(async (result) => {
      localStorage.setItem(STORAGE.GROUP_CODE_SELECTED, result?.payload?.code);
      localStorage.setItem(STORAGE.GROUP_UUID_SELECTED, result?.payload?.uuid);
      dispatch({
        type: 'userInGroup/fetchAllUserInGroup',
        payload: {
          code: result?.payload?.code,
        },
      });
    });
  }, []);

  const showDrawerAddUserIntoGroup = () => {
    setOpenDrawerAdd(true);
  };

  const closeDrawerAddUserIntoGroup = () => {
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
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.role',
      }),
      dataIndex: 'roles',
      render: (_, record) => (
        <Space>
          {record.roles.map((r) => (
            <Tag color="rgba(108, 117, 125, 0.12)" key={r}>
              {r}
            </Tag>
          ))}
        </Space>
      ),
    },

    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.option',
      }),
      fixed: 'right',

      render: (text, record) => {
        return (
          <Space>
            {permissionCheck('delete_user') && (
              <Popconfirm
                title={intl.formatMessage({
                  id: 'pages.setting-user.list-user.delete-confirm',
                })}
                onConfirm={() => handleDeleteUserInGroup(record.uuid)}
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
                  <CloseOutlined />
                </Tooltip>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  const onPaginationChange = (page, size) => {
    dispatch({
      type: 'userInGroup/fetchAllUserInGroup',
      payload: {
        code: localStorage.getItem(STORAGE.GROUP_CODE_SELECTED),
      },
    });
  };

  const handleDeleteUserInGroup = async (userUuid) => {
    let dataRemove = {
      user_uuid: userUuid,
      group_uuid: localStorage.getItem(STORAGE.GROUP_UUID_SELECTED),
    };

    dispatch({
      type: 'userInGroup/remove',
      payload: dataRemove,
    });
  };

  return (
    <div>
      <EditableProTable
        loading={loading}
        headerTitle={intl.formatMessage({
          id: 'pages.setting-user.list-user.listUserInGroup',
        })}
        rowKey="uuid"
        search={false}
        value={list}
        columns={columns}
        options={false}
        recordCreatorProps={{
          creatorButtonText: intl.formatMessage({
            id: 'pages.setting-user.list-user.add-user-in-group',
          }),
          onClick: () => showDrawerAddUserIntoGroup(),
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
          total: list?.length,
          onChange: onPaginationChange,
          pageSize: 5,
          current: 1,
        }}
      />
      {showDrawerAdd && (
        <AddUserIntoGroup onClose={closeDrawerAddUserIntoGroup} openDrawer={showDrawerAdd} />
      )}
    </div>
  );
}

function mapStateToProps(state) {
  const { list, metadata } = state.userInGroup;
  return {
    loading: state.loading.models.userInGroup,
    list,
    metadata,
  };
}

export default connect(mapStateToProps)(TableUserInGroup);
