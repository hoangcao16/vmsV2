import { STORAGE } from '@/constants/common';
import UserApi from '@/services/user/UserApi';
import { CloseOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Checkbox, Popconfirm, Space, Tooltip } from 'antd';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { useIntl } from 'umi';
import AddCameraGroupPermission from './AddCameraGroupPermission';

function TableGroupCameraPermission({
  id,
  dispatch,
  listCameraGroupPermission,
  metadata,
  listCameraGroupNotPermission,
}) {
  const intl = useIntl();

  useEffect(() => {
    UserApi.getUserGroupById(id).then(async (result) => {
      localStorage.setItem(STORAGE.GROUP_CODE_SELECTED, result?.payload?.code);
      localStorage.setItem(STORAGE.GROUP_UUID_SELECTED, result?.payload?.uuid);
      dispatch({
        type: 'groupCameraPermissionInGroupUser/fetchAllPermissionCameraGroups',
        payload: {
          code: result?.payload?.code,
        },
      });
    });
  }, []);

  async function onChange(e, name, cameraGroupId) {
    const data = {
      subject: `user_g@${localStorage.getItem(STORAGE.GROUP_CODE_SELECTED)}`,
      object: `cam_g@${cameraGroupId}`,
      action: name,
    };
    if (e.target.checked) {
      //dispatch
      dispatch({
        type: 'groupCameraPermissionInGroupUser/setPermisionCameraGroups',
        payload: data,
      });

      return;
    }
    const dataRemove = {
      policies: [data],
    };
    //dispatch
    dispatch({
      type: 'groupCameraPermissionInGroupUser/removePermisionCameraGroups',
      payload: dataRemove,
    });
  }

  const removeAllPermmisionInCameraGroups = async (record) => {
    if (
      record?.view_online &&
      !record?.view_offline &&
      !record?.setup_preset &&
      !record?.ptz_control
    ) {
      const data = [];
      data.push({
        subject: `user_g@${localStorage.getItem(STORAGE.GROUP_CODE_SELECTED)}`,
        object: `cam_g@${record.cam_group_uuid}`,
        action: 'view_online',
      });

      const dataRemove = {
        policies: data,
      };

      //dispatch
      dispatch({
        type: 'groupCameraPermissionInGroupUser/removePermisionCameraGroups',
        payload: dataRemove,
      });

      return;
    }

    const data = [];
    if (record?.view_online) {
      data.push({
        subject: `user_g@${localStorage.getItem(STORAGE.GROUP_CODE_SELECTED)}`,
        object: `cam_g@${record.cam_group_uuid}`,
        action: 'view_online',
      });
    }
    if (record?.view_offline) {
      data.push({
        subject: `user_g@${localStorage.getItem(STORAGE.GROUP_CODE_SELECTED)}`,
        object: `cam_g@${record.cam_group_uuid}`,
        action: 'view_offline',
      });
    }
    if (record?.setup_preset) {
      data.push({
        subject: `user_g@${localStorage.getItem(STORAGE.GROUP_CODE_SELECTED)}`,
        object: `cam_g@${record.cam_group_uuid}`,
        action: 'setup_preset',
      });
    }
    if (record?.ptz_control) {
      data.push({
        subject: `user_g@${localStorage.getItem(STORAGE.GROUP_CODE_SELECTED)}`,
        object: `cam_g@${record.cam_group_uuid}`,
        action: 'ptz_control',
      });
    }
    const dataRemove = {
      policies: data,
    };

    //dispatch
    dispatch({
      type: 'groupCameraPermissionInGroupUser/removePermisionCameraGroups',
      payload: dataRemove,
    });
  };

  const viewOnline = (record) => {
    let defaultChecked = true;

    if (record.view_online === undefined) {
      defaultChecked = false;
    }

    return (
      <Checkbox
        onChange={(e) => onChange(e, 'view_online', record.cam_group_uuid)}
        checked={defaultChecked}
        disabled={record.isDisableRow}
      />
    );
  };

  const viewOffline = (record) => {
    let defaultChecked = true;

    if (record.view_offline === undefined) {
      defaultChecked = false;
    }

    return (
      <Checkbox
        onChange={(e) => onChange(e, 'view_offline', record.cam_group_uuid)}
        checked={defaultChecked}
        disabled={record.isDisableRow}
      />
    );
  };
  const setupPreset = (record) => {
    let defaultChecked = true;

    if (record.setup_preset === undefined) {
      defaultChecked = false;
    }

    return (
      <Checkbox
        onChange={(e) => onChange(e, 'setup_preset', record.cam_group_uuid)}
        checked={defaultChecked}
        disabled={record.isDisableRow}
      />
    );
  };

  const ptzControl = (record) => {
    let defaultChecked = true;

    if (record.ptz_control === undefined) {
      defaultChecked = false;
    }

    return (
      <Checkbox
        onChange={(e) => onChange(e, 'ptz_control', record.cam_group_uuid)}
        checked={defaultChecked}
        disabled={record.isDisableRow}
      />
    );
  };

  const columns = [
    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.cameraGroup',
      }),
      dataIndex: 'cam_group_name',
      width: '15%',
    },

    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.view_online',
      }),
      dataIndex: 'view_online',
      render: (text, record) => {
        return <Space>{viewOnline(record)}</Space>;
      },
      width: '15%',
    },
    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.view_offline',
      }),
      dataIndex: 'view_offline',
      render: (text, record) => {
        return <Space>{viewOffline(record)}</Space>;
      },
      width: '15%',
    },
    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.setup_preset',
      }),
      dataIndex: 'setup_preset',
      render: (text, record) => {
        return <Space>{setupPreset(record)}</Space>;
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.ptz_control',
      }),
      dataIndex: 'ptz_control',
      render: (text, record) => {
        return <Space>{ptzControl(record)}</Space>;
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.option',
      }),
      fixed: 'right',
      width: '15%',
      render: (text, record) => {
        return (
          <Space>
            {!record.isDisableRow && (
              <Popconfirm
                title={intl.formatMessage({
                  id: 'pages.setting-user.list-user.delete-confirm',
                })}
                onConfirm={() => removeAllPermmisionInCameraGroups(record)}
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

  return (
    <div>
      {' '}
      <ProTable
        // loading={loading}
        headerTitle={intl.formatMessage({
          id: 'pages.setting-user.list-user.permissionCameraGroups',
        })}
        rowKey="uuid"
        search={false}
        dataSource={listCameraGroupPermission}
        columns={columns}
        // rowSelection={{}}
        options={false}
        toolbar={{
          multipleLine: true,

          actions: [
            <AddCameraGroupPermission
              key="add-camera-group-permission"
              listCameraGroupNotPermission={listCameraGroupNotPermission}
            />,
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
          total: listCameraGroupPermission?.length,
          onChange: onPaginationChange,
          pageSize: 5,
          current: 1,
        }}
      />
    </div>
  );
}

function mapStateToProps(state) {
  const { listCameraGroupPermission, metadata, listCameraGroupNotPermission } =
    state.groupCameraPermissionInGroupUser;
  return {
    loading: state.loading.models.groupCameraPermissionInGroupUser,
    listCameraGroupPermission,
    metadata,
    listCameraGroupNotPermission,
  };
}

export default connect(mapStateToProps)(TableGroupCameraPermission);
