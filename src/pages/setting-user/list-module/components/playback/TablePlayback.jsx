import MSCustomizeDrawer from '@/components/Drawer';
import MSFormItem from '@/components/Form/Item';
import { EditOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, Col, Form, Input, Row, Space, Tag, Tooltip } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import EditPlayback from './EditPlayback';

const TablePlayback = ({ dispatch, list, metadata }) => {
  const intl = useIntl();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedPlaybackEdit, setSelectedPlaybackEdit] = useState(null);

  useEffect(() => {
    dispatch({
      type: 'playback/fetchAllPlayback',
      payload: {
        filter: '',
        page: metadata?.page,
        size: metadata?.size,
        name: metadata?.name,
      },
    });
  }, []);

  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onClose = () => {
    setOpenDrawer(false);
  };

  const renderTag = (cellValue) => {
    return (
      <Tag color={cellValue === 'UP' ? '#1380FF' : '#FF4646'} style={{ color: '#ffffff' }}>
        {cellValue === 'UP' ? `Đang hoạt động` : `Dừng hoạt động`}
      </Tag>
    );
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
        id: 'view.common_device.playback_name',
      }),
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: intl.formatMessage({
        id: 'view.common_device.desc',
      }),
      dataIndex: 'description',
      key: 'description',
      width: '20%',
    },
    {
      title: intl.formatMessage({
        id: 'view.common_device.note',
      }),
      dataIndex: 'note',
      key: 'note',
      width: '20%',
    },
    {
      title: intl.formatMessage({
        id: 'view.common_device.status',
      }),
      dataIndex: 'status',
      key: 'status',
      width: '20%',
      render: renderTag,
    },
    {
      title: intl.formatMessage({
        id: 'view.common_device.action',
      }),
      width: '15%',
      render: (text, record) => {
        return (
          <Space>
            <Tooltip placement="rightTop" title="Chỉnh sửa">
              <EditOutlined
                style={{ fontSize: '16px', color: '#6E6B7B' }}
                onClick={() => {
                  showDrawer();
                  setSelectedPlaybackEdit(record);
                }}
              />
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
          id: 'view.common_device.playback_list',
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
        }}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) => `${total} Playback`,
          total: metadata?.total,
          pageSize: metadata?.size,
          current: metadata?.page,
        }}
      />
      {openDrawer && (
        <MSCustomizeDrawer
          openDrawer={openDrawer}
          onClose={onClose}
          width={'30%'}
          zIndex={1001}
          title={`${intl.formatMessage({
            id: 'view.common_device.edit_playback',
          })}`}
          placement="right"
        >
          <EditPlayback
            selectedPlaybackEdit={selectedPlaybackEdit}
            onClose={onClose}
            dispatch={dispatch}
          />
        </MSCustomizeDrawer>
      )}
    </>
  );
};

function mapStateToProps(state) {
  const { list, metadata } = state.playback;
  return {
    loading: state.loading.models.playback,
    list,
    metadata,
  };
}
export default connect(mapStateToProps)(TablePlayback);
