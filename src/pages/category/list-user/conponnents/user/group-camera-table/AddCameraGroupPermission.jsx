import MSCustomizeDrawer from '@/components/Drawer';
import { STORAGE } from '@/constants/common';
import TableUtils from '@/utils/TableHelper';
import ProTable from '@ant-design/pro-table';
import { Button, Space, Empty } from 'antd';
import { connect } from 'dva';
import { useIntl } from 'umi';
function AddCameraGroupPermission({ dispatch, listCameraGroupNotPermission, onClose, openDrawer }) {
  const intl = useIntl();

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

  const onPaginationChange = (page, size) => {};
  const handleAddCameraGroupPermission = ({ selectedRowKeys }) => {
    const data = selectedRowKeys.map((s) => {
      return {
        subject: `user@${localStorage.getItem(STORAGE.USER_UUID_SELECTED)}`,
        object: `cam_g@${s}`,
        action: 'view_online',
      };
    });

    const dataAdd = {
      policies: data,
    };

    dispatch({
      type: 'groupCameraPermissionInUser/setMultiPermisionCameraGroups',
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
          width={'50%'}
          zIndex={1006}
          title={intl.formatMessage({
            id: 'pages.setting-user.list-user.cameraGroup',
          })}
          placement="right"
        >
          <>
            <ProTable
              headerTitle={intl.formatMessage({
                id: 'pages.setting-user.list-user.cameraGroup',
              })}
              rowKey="uuid"
              search={false}
              locale={{
                emptyText: (
                  <Empty description={intl.formatMessage({ id: 'view.ai_config.no_data' })} />
                ),
              }}
              dataSource={listCameraGroupNotPermission}
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
                      onClick={() => handleAddCameraGroupPermission(selectedRowKeys)}
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
                total: listCameraGroupNotPermission?.length,
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

export default connect(mapStateToProps)(AddCameraGroupPermission);
