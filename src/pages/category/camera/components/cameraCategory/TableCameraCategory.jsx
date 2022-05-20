import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { connect } from 'dva';
import { ProTableStyle } from '../../style';
import AddEditCameraCategory from './AddEditCameraCategory';

const TableVendorType = ({ dispatch, listVendor, listType, listTags, metadata, type }) => {
  const intl = useIntl();
  const [openDrawerAddEdit, setOpenDrawerAddEdit] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    dispatch({
      type: 'cameraCategory/fetchAllVendor',
      payload: {
        name: metadata?.name,
        size: metadata?.size,
      },
    });
    dispatch({
      type: 'cameraCategory/fetchAllType',
      payload: {
        name: metadata?.name,
        size: metadata?.size,
      },
    });
    dispatch({
      type: 'cameraCategory/fetchAllTags',
      payload: {
        name: metadata?.name,
        size: metadata?.size,
      },
    });
  }, []);

  const categoryColumns = [
    {
      title: intl.formatMessage({
        id: 'view.storage.NO',
      }),
      key: 'index',
      width: '15%',
      render: (text, record, index) => index + 1,
    },

    {
      title: intl.formatMessage({
        id: 'view.category.category_name',
      }),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
  ];

  const addTagColumns = [
    {
      title: intl.formatMessage({
        id: 'view.category.category_name',
      }),
      dataIndex: 'key',
      key: 'key',
    },
  ];

  if (type === 'camera_tags') {
    categoryColumns.splice(1, 1, ...addTagColumns);
  }

  return (
    <>
      <ProTableStyle
        headerTitle={`${intl.formatMessage(
          {
            id: `view.${
              type === 'camera_vendor' ? 'category.camera_vendor' : 'camera.camera_type'
            }`,
          },
          {
            cam: intl.formatMessage({
              id: 'camera',
            }),
          },
        )}`}
        rowKey="id"
        search={false}
        dataSource={
          type === 'camera_vendor' ? listVendor : type === 'camera_type' ? listType : listTags
        }
        columns={categoryColumns}
        options={false}
        onRow={(record) => {
          return {
            onClick: () => {
              setOpenDrawerAddEdit(true);
              setSelectedRecord(record);
            },
          };
        }}
        toolbar={{
          multipleLine: true,
          //   filter: (
          //     <AutoComplete key="search" onSearch={debounce(handleSearch, 1000)}>
          //       <Input.Search
          //         placeholder={intl.formatMessage(
          //           { id: 'view.common_device.please_enter_zone_name' },
          //           {
          //             plsEnter: intl.formatMessage({
          //               id: 'please_enter',
          //             }),
          //           },
          //         )}
          //       />
          //     </AutoComplete>
          //   ),
          actions: [
            <Button
              key="add"
              type="primary"
              onClick={() => {
                setOpenDrawerAddEdit(true);
                setSelectedRecord(null);
              }}
            >
              <PlusOutlined />
              {intl.formatMessage({ id: 'add' })}
            </Button>,
          ],
        }}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) =>
            `${intl.formatMessage({
              id: 'view.camera.total',
            })} ${total} ${intl.formatMessage(
              {
                id: `view.${
                  type === 'camera_vendor' ? 'category.camera_vendor' : 'camera.camera_type'
                }`,
              },
              {
                cam: intl.formatMessage({
                  id: 'camera',
                }),
              },
            )}`,
          // total: metadata?.total,
          pageSize: 10,
          // current: metadata?.page,
        }}
      />

      {openDrawerAddEdit && (
        <AddEditCameraCategory
          onClose={() => setOpenDrawerAddEdit(false)}
          dispatch={dispatch}
          selectedRecord={selectedRecord}
          openDrawer={openDrawerAddEdit}
          type={type}
        />
      )}
    </>
  );
};

function mapStateToProps(state) {
  const { metadata, listVendor, listType, listTags } = state.cameraCategory;
  return {
    loading: state.loading.models.cameraCategory,
    metadata,
    listVendor,
    listType,
    listTags,
  };
}

export default connect(mapStateToProps)(TableVendorType);
