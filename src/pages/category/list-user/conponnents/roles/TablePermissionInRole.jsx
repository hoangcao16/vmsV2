import { STORAGE } from '@/constants/common';
import UserApi from '@/services/user/UserApi';
import permissionCheck from '@/utils/PermissionCheck';
import { CloseOutlined } from '@ant-design/icons';
import { EditableProTable } from '@ant-design/pro-table';
import { Popconfirm, Space, Tooltip, Empty } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import AddPermissionIntoGroup from './SettingPermissionRole';

function TablePermissionInRole({ id, dispatch, list, loading }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const intl = useIntl();

  useEffect(() => {
    UserApi.getRoleByUuid(id).then(async (result) => {
      localStorage.setItem(STORAGE.ROLE_CODE_SELECTED, result?.payload?.code);
      localStorage.setItem(STORAGE.ROLE_UUID_SELECTED, result?.payload?.uuid);
      dispatch({
        type: 'premissionInRole/fetchAllPermissionInRole',
        payload: {
          code: result?.payload?.code,
        },
      });
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
      fixed: 'right',

      render: (text, record) => {
        return (
          <Space>
            {permissionCheck('delete_user') && (
              <Popconfirm
                title={intl.formatMessage({
                  id: 'pages.setting-user.list-user.delete-confirm',
                })}
                onConfirm={() => handleDeletePermissionInRole(record?.code)}
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

  const onPaginationChange = (page, size) => {};

  const handleDeletePermissionInRole = async (permissionCode) => {
    const data = {
      subject: `role@${localStorage.getItem(STORAGE.ROLE_CODE_SELECTED)}`,
      object: `role@${localStorage.getItem(STORAGE.ROLE_CODE_SELECTED)}`,
      action: permissionCode,
    };

    const dataRemove = {
      policies: [data],
    };

    dispatch({
      type: 'premissionInRole/remove',
      payload: dataRemove,
    });
  };

  return (
    <div>
      {' '}
      <EditableProTable
        loading={loading}
        headerTitle={intl.formatMessage({
          id: 'pages.setting-user.list-user.list-permission',
        })}
        rowKey="uuid"
        search={false}
        locale={{
          emptyText: <Empty description={intl.formatMessage({ id: 'view.ai_config.no_data' })} />,
        }}
        value={list}
        columns={columns}
        // rowSelection={{}}
        options={false}
        recordCreatorProps={{
          creatorButtonText: intl.formatMessage({
            id: 'pages.setting-user.list-user.setting-per',
          }),
          onClick: () => showDrawer(),
        }}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) =>
            `${intl.formatMessage({
              id: 'pages.setting-user.list-user.total',
            })} ${total} `,
          total: list?.length,
          onChange: onPaginationChange,
          pageSize: 5,
          current: 1,
        }}
      />
      {openDrawer && <AddPermissionIntoGroup onClose={onClose} openDrawer={openDrawer} />}
    </div>
  );
}

function mapStateToProps(state) {
  const { list, metadata } = state.premissionInRole;
  return {
    loading: state.loading.models.premissionInRole,
    list,
    metadata,
    checkedPermission: list?.map((po) => po.code),
  };
}

export default connect(mapStateToProps)(TablePermissionInRole);
