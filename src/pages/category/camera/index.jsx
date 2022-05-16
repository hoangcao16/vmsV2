/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Input } from 'antd';
import { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { ProTableStyle } from './style';
import { connect } from 'dva';
import { useIntl } from 'umi';
import {
  EyeOutlined,
  EnvironmentOutlined,
  EditOutlined,
  PlusOutlined,
  ExportOutlined,
  ScanOutlined,
  FilterOutlined,
  MergeCellsOutlined,
} from '@ant-design/icons';
import AddCamera from './components/add-camera';
const { Search } = Input;
const CameraList = ({ dispatch, list, metadata }) => {
  const [isAddNewDrawer, setIsAddNewDrawer] = useState(false);
  const intl = useIntl();
  const columns = [
    {
      title: intl.formatMessage(
        { id: 'view.map.camera_id' },
        {
          cam: '',
        },
      ),
      dataIndex: 'code',
    },
    {
      title: intl.formatMessage(
        { id: 'view.map.camera_name' },
        {
          cam: intl.formatMessage({ id: 'camera' }),
        },
      ),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'view.map.province_id',
      }),
      dataIndex: 'provinceName',
    },
    {
      title: intl.formatMessage({
        id: 'view.map.district_id',
      }),
      dataIndex: 'districtName',
    },
    {
      title: intl.formatMessage({
        id: 'view.map.ward_id',
      }),
      dataIndex: 'wardName',
    },
    {
      title: intl.formatMessage({
        id: 'view.map.address',
      }),
      dataIndex: 'zoneName',
    },
    {
      title: intl.formatMessage({
        id: 'view.map.zone',
      }),
      dataIndex: 'zoneName',
    },
    {
      title: intl.formatMessage({
        id: 'view.common_device.status',
      }),
      dataIndex: 'cameraStatus',
      hideInForm: true,
      valueEnum: {
        0: {
          text: intl.formatMessage({
            id: 'view.camera.active',
          }),
          status: 'Success',
        },
        1: {
          text: intl.formatMessage({
            id: 'view.user.detail_list.pause',
          }),
          status: 'Default',
        },
        2: {
          text: intl.formatMessage({
            id: 'view.camera.error',
          }),
          status: 'Error',
        },
      },
    },
    {
      title: '',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <>
          <EyeOutlined />
          <EnvironmentOutlined />
          <EditOutlined />
        </>,
      ],
    },
  ];
  const onPaginationChange = (page, size) => {
    dispatch({
      type: 'camera/fetchAllCamera',
      payload: {
        page,
        size,
      },
    });
  };
  useEffect(() => {
    dispatch({
      type: 'camera/fetchAllCamera',
      payload: {
        page: metadata?.page,
        size: metadata?.size,
      },
    });
  }, []);
  return (
    <PageContainer>
      <ProTableStyle
        headerTitle={intl.formatMessage(
          {
            id: 'view.camera.camera_list',
          },
          {
            cam: intl.formatMessage({
              id: 'camera',
            }),
          },
        )}
        rowKey="uuid"
        search={false}
        dataSource={list}
        columns={columns}
        rowSelection={{}}
        options={false}
        toolbar={{
          multipleLine: true,
          filter: (
            <Search
              placeholder={intl.formatMessage({
                id: 'view.camera.find_camera',
              })}
            />
          ),
          actions: [
            <Button
              key="group"
              onClick={() => {
                alert('add');
              }}
            >
              <MergeCellsOutlined />
              {intl.formatMessage({
                id: 'view.camera.group_camera',
              })}
            </Button>,
            <Button
              key="add"
              type="primary"
              onClick={() => {
                setIsAddNewDrawer(true);
              }}
            >
              <PlusOutlined />
              {intl.formatMessage({
                id: 'view.camera.add_camera',
              })}
            </Button>,
            <ExportOutlined
              key="export"
              onClick={() => {
                alert('export');
              }}
            />,
            <ScanOutlined
              key="scan"
              onClick={() => {
                alert('scan');
              }}
            />,
            <FilterOutlined
              key="filter"
              onClick={() => {
                alert('filter');
              }}
            />,
          ],
        }}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) =>
            `${intl.formatMessage({
              id: 'view.camera.total',
            })} ${total} camera`,
          total: metadata?.total,
          onChange: onPaginationChange,
          pageSize: metadata?.size,
          current: metadata?.page,
        }}
      />
      <div>
        <AddCamera openDrawer={isAddNewDrawer} setIsAddNewDrawer={setIsAddNewDrawer} />
      </div>
    </PageContainer>
  );
};
function mapStateToProps(state) {
  const { list, metadata } = state.camera;
  return {
    loading: state.loading.models.camera,
    list,
    metadata,
  };
}

export default connect(mapStateToProps)(CameraList);
