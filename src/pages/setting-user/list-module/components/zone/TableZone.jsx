import MSCustomizeDrawer from '@/components/Drawer';
import MSFormItem from '@/components/Form/Item';
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, Col, Form, Input, Row, Space, Tag, Tooltip } from 'antd';
import { connect } from 'dva';
import { useState } from 'react';
import { useIntl } from 'umi';
import DetailZone from './DetailZone';

const TableZone = ({ dispatch, list, metadata }) => {
  const intl = useIntl();
  const [openDrawerDetail, setOpenDrawerDetail] = useState(false);
  const [selectedZoneDetail, setSelectedZoneDetail] = useState(null);

  const onCloseDetails = () => {
    setOpenDrawerDetail(false);
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: '5%',
      render: (text, record, index) => index + 1,
    },
    {
      title: intl.formatMessage({
        id: 'view.common_device.zone_name',
      }),
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    },
    {
      title: intl.formatMessage({
        id: 'view.map.address',
      }),
      dataIndex: 'address',
      key: 'address',
      width: '30%',
    },
    {
      title: intl.formatMessage({
        id: 'view.user.detail_list.desc',
      }),
      dataIndex: 'description',
      key: 'description',
      width: '20%',
    },
    {
      title: intl.formatMessage({
        id: 'view.common_device.action',
      }),
      width: '15%',
      render: (text, record) => {
        return (
          <Space>
            <Tooltip placement="top" title="Chi tiết">
              <InfoCircleOutlined
                onClick={() => {
                  setOpenDrawerDetail(true);
                  setSelectedZoneDetail(record);
                }}
                style={{ fontSize: '16px', color: '#6E6B7B' }}
              />
            </Tooltip>
            <Tooltip placement="top" title="Chỉnh sửa">
              <EditOutlined style={{ fontSize: '16px', color: '#6E6B7B' }} />
            </Tooltip>
            <Tooltip placement="top" title="Xóa">
              <DeleteOutlined style={{ fontSize: '16px', color: '#6E6B7B' }} />
            </Tooltip>
          </Space>
        );
      },
    },
  ];
  return (
    <>
      <ProTable
        headerTitle={`${intl.formatMessage({
          id: 'view.common_device.zone_list',
        })}`}
        rowKey="id"
        search={false}
        dataSource={list}
        columns={columns}
        options={false}
        toolbar={{
          multipleLine: true,
          search: {
            onSearch: (value) => {
              alert(value);
            },
          },
          actions: [
            <Button
              key="add"
              type="primary"
              onClick={() => {
                alert('add');
              }}
            >
              <PlusOutlined />
              Thêm zone
            </Button>,
          ],
        }}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) => `${total} Zone`,
          total: metadata?.total,
          pageSize: metadata?.size,
          current: metadata?.page,
        }}
      />
      {openDrawerDetail && (
        <MSCustomizeDrawer
          openDrawer={openDrawerDetail}
          onClose={onCloseDetails}
          width={'30%'}
          zIndex={1001}
          title={`${intl.formatMessage({
            id: 'view.common_device.zone_detail',
          })}`}
          placement="right"
        >
          <DetailZone onClose={onCloseDetails} selectedZoneDetail={selectedZoneDetail} />
        </MSCustomizeDrawer>
      )}
    </>
  );
};

function mapStateToProps(state) {
  const { list, metadata } = state.zone;
  return {
    loading: state.loading.models.zone,
    list,
    metadata,
  };
}
export default connect(mapStateToProps)(TableZone);
