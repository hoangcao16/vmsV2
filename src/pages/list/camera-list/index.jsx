import { Button, message, Input } from 'antd';
import { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { LightFilter } from '@ant-design/pro-form';
import { connect } from 'dva';
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

const { Search } = Input;
const CameraList = ({ dispatch, list, metadata }) => {
  const columns = [
    {
      title: 'Mã',
      dataIndex: 'name',
    },
    {
      title: 'Tên camera',
      dataIndex: 'name',
    },
    {
      title: 'Tỉnh/TP',
      dataIndex: 'provinceName',
    },
    {
      title: 'Quận/Huyện',
      dataIndex: 'districtName',
    },
    {
      title: 'Phường/Xã',
      dataIndex: 'wardName',
    },
    {
      title: 'Địa điểm',
      dataIndex: 'zoneName',
    },
    {
      title: 'Khu vực',
      dataIndex: 'zoneName',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'cameraStatus',
      hideInForm: true,
      valueEnum: {
        0: {
          text: 'Đang hoạt động',
          status: 'Success',
        },
        1: {
          text: 'Tạm dừng',
          status: 'Default',
        },
        2: {
          text: 'Lỗi',
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
  return (
    <PageContainer>
      <ProTable
        headerTitle="Danh sách camera"
        rowKey="id"
        search={false}
        dataSource={list}
        columns={columns}
        rowSelection={{}}
        options={false}
        toolbar={{
          multipleLine: true,
          filter: (
            <LightFilter>
              <Search placeholder="Tìm kiếm theo tên camera, địa chỉ" />
            </LightFilter>
          ),
          actions: [
            <Button
              key="group"
              onClick={() => {
                alert('add');
              }}
            >
              <MergeCellsOutlined />
              Nhóm camera
            </Button>,
            <Button
              key="add"
              type="primary"
              onClick={() => {
                alert('add');
              }}
            >
              <PlusOutlined />
              Thêm camera
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
          showTotal: (total) => `Tổng cộng ${total} camera`,
          total: metadata?.total,
          onChange: onPaginationChange,
          pageSize: metadata?.size,
          current: metadata?.page,
        }}
      />
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
