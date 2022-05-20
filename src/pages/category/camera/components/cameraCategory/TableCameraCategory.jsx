import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useEffect } from 'react';
import { useIntl } from 'umi';
import { connect } from 'dva';
import { ProTableStyle } from '../../style';

const TableVendorType = ({
  dispatch,
  cameraTypesOptions,
  tagsOptions,
  vendorsOptions,
  metadata,
  type,
}) => {
  const intl = useIntl();

  console.log('type', type);

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

  //   useEffect(() => {
  //     if (type === 'camera_vendor') {
  //       dispatch({
  //         type: 'category/fetchAllVendor',
  //         payload: {
  //           size: metadata?.size,
  //           name: metadata?.name,
  //         },
  //       });
  //     } else if (type === 'camera_type') {
  //       dispatch({
  //         type: 'category/fetchAllType',
  //         payload: {
  //           size: metadata?.size,
  //           name: metadata?.name,
  //         },
  //       });
  //     } else if (type === 'camera_tags') {
  //       dispatch({
  //         type: 'category/fetchAllTags',
  //         payload: {
  //           size: metadata?.size,
  //           name: metadata?.name,
  //         },
  //       });
  //     }
  //   }, [type]);

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
          type === 'camera_vendor'
            ? vendorsOptions
            : type === 'camera_type'
            ? cameraTypesOptions
            : tagsOptions
        }
        columns={categoryColumns}
        options={false}
        onRow={(record) => {
          return {
            onClick: () => {
              //   setOpenDrawerAddEdit(true);
              //   setSelectedRecord(record);
              console.log('record', record);
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
          //   actions: [
          //     <Button
          //       key="add"
          //       type="primary"
          //       onClick={() => {
          //         setOpenDrawerAddEdit(true);
          //         setSelectedRecord(null);
          //       }}
          //     >
          //       <PlusOutlined />
          //       {intl.formatMessage(
          //         { id: 'view.common_device.add_zone' },
          //         {
          //           add: intl.formatMessage({
          //             id: 'add',
          //           }),
          //         },
          //       )}
          //     </Button>,
          //   ],
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
          // pageSize: metadata?.size,
          // current: metadata?.page,
        }}
      />
    </>
  );
};

function mapStateToProps(state) {
  const { metadata } = state.category;
  const { cameraTypesOptions, tagsOptions, vendorsOptions } = state.globalstore;
  return {
    loading: state.loading.models.category,
    metadata,
    cameraTypesOptions,
    tagsOptions,
    vendorsOptions,
  };
}

export default connect(mapStateToProps)(TableVendorType);
