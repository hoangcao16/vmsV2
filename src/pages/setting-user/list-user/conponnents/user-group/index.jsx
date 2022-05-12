import MSCustomizeDrawer from '@/components/Drawer';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import ProTable, { Search } from '@ant-design/pro-table';
import { Button, Space, Tooltip } from 'antd';
import React, { useState } from 'react';
import AddUserGroup from './AddUserGroup';
import { connect } from 'dva';
import { LightFilter } from '@ant-design/pro-form';
import { useEffect } from 'react';
import permissionCheck from '@/utils/PermissionCheck';

function UserGroup({ dispatch, list, metadata }) {
  const [openDrawer, setOpenDrawer] = useState(false);

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

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
    },

    {
      title: 'Thao tác',
      dataIndex: 'option',
      valueType: 'option',
      render: (text, record) => {
        return (
          <>
            <Space>
              {permissionCheck('edit_user_group') && (
                <Tooltip placement="top" title="Sửa" arrowPointAtCenter={true}>
                  <EditOutlined />
                </Tooltip>
              )}
            </Space>
            <Space>
              {permissionCheck('delete_user_group') && (
                <Tooltip placement="top" title="Xóa" arrowPointAtCenter={true}>
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
          Nhóm người dùng
        </Button>
      </Space>
      {openDrawer && (
        <MSCustomizeDrawer
          openDrawer={openDrawer}
          onClose={onClose}
          width={'80%'}
          zIndex={1001}
          title="Danh sách nhóm người dùng"
          placement="right"
        >
          <>
            <ProTable
              // loading={loading}
              headerTitle="Danh sách nhóm người dùng"
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
                actions: [<AddUserGroup key="add-user-group" />],
                style: { width: '100%' },
              }}
              pagination={{
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: (total) => `Tổng cộng ${total} nhóm người dùng`,
                total: metadata?.total,
                onChange: onPaginationChange,
                pageSize: metadata?.size,
                current: metadata?.page,
              }}
            />
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
