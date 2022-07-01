import MSCustomizeDrawer from '@/components/Drawer';
import { STORAGE } from '@/constants/common';
import TableUtils from '@/utils/TableHelper';
import ProTable from '@ant-design/pro-table';
import { Button, Space, Tag, Empty } from 'antd';
import { connect } from 'dva';
import { useIntl } from 'umi';
function AddCameraPermission({ dispatch, listCameraNotPermission, openDrawer, onClose }) {
  const intl = useIntl();

  const statusTag = (cellValue, row) => {
    return (
      <Tag color={cellValue == 0 ? 'error' : 'success'}>
        {intl.formatMessage({
          id:
            cellValue == 0
              ? 'pages.setting-user.list-user.inactive'
              : 'pages.setting-user.list-user.active',
        })}
      </Tag>
    );
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
        id: 'pages.setting-user.list-user.cameraTypeName',
      }),
      dataIndex: 'cameraTypeName',
      ...TableUtils.getColumnSearchProps('cameraTypeName'),
    },
    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.provinceName',
      }),
      dataIndex: 'provinceName',
      key: 'provinceName',
    },
    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.districtName',
      }),
      dataIndex: 'districtName',
      key: 'provinceName',
    },
    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.wardName',
      }),
      dataIndex: 'wardName',
      key: 'wardName',
    },

    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.address',
      }),
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.recordingStatus',
      }),
      dataIndex: 'recordingStatus',
      key: 'recordingStatus',
      render: statusTag,
    },

    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.administrativeUnitName',
      }),
      dataIndex: 'administrativeUnitName',
      key: 'administrativeUnitName',
    },
  ];

  const onPaginationChange = (page, size) => {};
  const handleAddCameraPermission = ({ selectedRowKeys }) => {
    const data = selectedRowKeys.map((s) => {
      return {
        subject: `role@${localStorage.getItem(STORAGE.ROLE_CODE_SELECTED)}`,
        object: `cam@${s}`,
        action: 'view_online',
      };
    });

    const dataAdd = {
      policies: data,
    };

    dispatch({
      type: 'cameraPermissionInRole/setMultiPermisionCameras',
      payload: dataAdd,
    });

    onClose();
  };

  return (
    <>
      {openDrawer && (
        <MSCustomizeDrawer
          openDrawer={openDrawer}
          onClose={onClose}
          width={'75%'}
          zIndex={1006}
          title={intl.formatMessage({
            id: 'pages.setting-user.list-user.camera',
          })}
          placement="right"
        >
          <>
            <ProTable
              headerTitle={intl.formatMessage({
                id: 'pages.setting-user.list-user.camera',
              })}
              rowKey="uuid"
              search={false}
              locale={{
                emptyText: (
                  <Empty description={intl.formatMessage({ id: 'view.ai_config.no_data' })} />
                ),
              }}
              dataSource={listCameraNotPermission}
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
                    <Button
                      type="primary"
                      onClick={() => handleAddCameraPermission(selectedRowKeys)}
                    >
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
                total: listCameraNotPermission?.length,
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

function mapStateToProps(state) {}

export default connect(mapStateToProps)(AddCameraPermission);
