import { STORAGE } from '@/constants/common';
import { CloseOutlined } from '@ant-design/icons';
import { EditableProTable } from '@ant-design/pro-table';
import { Checkbox, Popconfirm, Space, Tooltip } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import AddCameraPermission from './AddCameraPermission';

function TableCameraPermission({
  id,
  dispatch,
  listCameraPermission,
  metadata,
  listCameraNotPermission,
  loading,
}) {
  const intl = useIntl();

  const [openDrawer, setOpenDrawer] = useState(false);

  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onClose = () => {
    setOpenDrawer(false);
  };

  useEffect(() => {
    dispatch({
      type: 'cameraPermissionInUser/fetchAllPermissionCamera',
      payload: {
        uuid: id ?? localStorage.getItem(STORAGE.USER_UUID_SELECTED),
      },
    });
  }, [id]);

  async function onChange(e, name, cameraGroupId) {
    const data = {
      subject: `user@${localStorage.getItem(STORAGE.USER_UUID_SELECTED) ?? id}`,
      object: `cam@${cameraGroupId}`,
      action: name,
    };
    if (e.target.checked) {
      //dispatch
      dispatch({
        type: 'cameraPermissionInUser/setPermisionCamera',
        payload: data,
      });

      return;
    }
    const dataRemove = {
      policies: [data],
    };
    //dispatch
    dispatch({
      type: 'cameraPermissionInUser/removePermisionCamera',
      payload: dataRemove,
    });
  }

  const removeAllPermmisionInCamera = async (record) => {
    const per = ['view_online', 'view_offline', 'setup_preset', 'ptz_control'];

    let data = [];

    for (let name of per) {
      if (record[name]) {
        data.push({
          subject: `user@${localStorage.getItem(STORAGE.USER_UUID_SELECTED)}`,
          object: `cam@${record.cam_uuid}`,
          action: name,
        });
      }
    }
    const dataRemove = {
      policies: data,
    };

    //dispatch
    dispatch({
      type: 'cameraPermissionInUser/removePermisionCamera',
      payload: dataRemove,
    });
  };

  const renderCheckbox = (record, namePer) => {
    return (
      <Checkbox
        onChange={(e) => onChange(e, namePer, record.cam_uuid)}
        checked={!!record[namePer]}
        disabled={record.isDisableRow}
      />
    );
  };
  const columns = [
    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.camera',
      }),
      dataIndex: 'cam_name',
      width: '15%',
    },

    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.view_online',
      }),
      dataIndex: 'view_online',
      render: (text, record) => {
        return <Space>{renderCheckbox(record, 'view_online')}</Space>;
      },
      width: '15%',
    },
    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.view_offline',
      }),
      dataIndex: 'view_offline',
      render: (text, record) => {
        return <Space>{renderCheckbox(record, 'view_offline')}</Space>;
      },
      width: '15%',
    },
    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.setup_preset',
      }),
      dataIndex: 'setup_preset',
      render: (text, record) => {
        return <Space>{renderCheckbox(record, 'setup_preset')}</Space>;
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.ptz_control',
      }),
      dataIndex: 'ptz_control',
      render: (text, record) => {
        return <Space>{renderCheckbox(record, 'ptz_control')}</Space>;
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
                onConfirm={() => removeAllPermmisionInCamera(record)}
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
      <EditableProTable
        loading={loading}
        headerTitle={intl.formatMessage({
          id: 'pages.setting-user.list-user.permissionCamera',
        })}
        rowKey="uuid"
        search={false}
        value={listCameraPermission}
        columns={columns}
        // rowSelection={{}}
        options={false}
        recordCreatorProps={{
          creatorButtonText: intl.formatMessage({
            id: 'pages.setting-user.list-user.permissionCamera',
          }),
          onClick: () => showDrawer(),
        }}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) =>
            `${intl.formatMessage({
              id: 'pages.setting-user.list-user.total',
            })} ${total}`,
          total: listCameraPermission?.length,
          onChange: onPaginationChange,
          pageSize: 5,
          current: 1,
        }}
      />
      {openDrawer && (
        <AddCameraPermission
          listCameraNotPermission={listCameraNotPermission}
          onClose={onClose}
          openDrawer={openDrawer}
        />
      )}
    </div>
  );
}

function mapStateToProps(state) {
  const { listCameraPermission, metadata, listCameraNotPermission } = state.cameraPermissionInUser;
  return {
    loading: state.loading.models.cameraPermissionInUser,
    listCameraPermission,
    metadata,
    listCameraNotPermission,
  };
}

export default connect(mapStateToProps)(TableCameraPermission);
