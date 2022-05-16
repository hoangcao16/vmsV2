import MSCustomizeDrawer from '@/components/Drawer';
import MSFormItem from '@/components/Form/Item';
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, Col, Form, Input, Row, Space, Tag, Tooltip } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import AddZone from './AddZone';
import DetailZone from './DetailZone';
import EditZone from './EditZone';

const TableZone = ({ dispatch, list, metadata }) => {
  const intl = useIntl();
  const [openDrawerDetail, setOpenDrawerDetail] = useState(false);
  const [openDrawerAdd, setOpenDrawerAdd] = useState(false);
  const [openDrawerEdit, setOpenDrawerEdit] = useState(false);

  const [selectedZoneDetail, setSelectedZoneDetail] = useState(null);

  useEffect(() => {
    dispatch({
      type: 'zone/fetchAllZone',
      payload: {
        filter: '',
        page: metadata?.page,
        size: metadata?.size,
        name: metadata?.name,
      },
    });
  }, []);

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
            <Tooltip
              placement="top"
              title={intl.formatMessage({
                id: 'view.common_device.detail',
              })}
            >
              <InfoCircleOutlined
                onClick={() => {
                  setOpenDrawerDetail(true);
                  setSelectedZoneDetail(record);
                }}
                style={{ fontSize: '16px', color: '#6E6B7B' }}
              />
            </Tooltip>
            <Tooltip
              placement="top"
              title={intl.formatMessage({
                id: 'view.common_device.edit',
              })}
            >
              <EditOutlined
                onClick={() => {
                  setOpenDrawerEdit(true);
                }}
                style={{ fontSize: '16px', color: '#6E6B7B' }}
              />
            </Tooltip>
            <Tooltip
              placement="top"
              title={intl.formatMessage({
                id: 'view.ai_events.delete',
              })}
            >
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
                setOpenDrawerAdd(true);
              }}
            >
              <PlusOutlined />
              {intl.formatMessage(
                { id: 'view.common_device.add_zone' },
                {
                  add: intl.formatMessage({
                    id: 'add',
                  }),
                },
              )}
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
      {openDrawerAdd && (
        <MSCustomizeDrawer
          openDrawer={openDrawerAdd}
          onClose={() => setOpenDrawerAdd(false)}
          width={'30%'}
          zIndex={1001}
          title={intl.formatMessage(
            { id: 'view.common_device.add_zone' },
            {
              add: intl.formatMessage({
                id: 'add',
              }),
            },
          )}
          placement="right"
        >
          <AddZone onClose={() => setOpenDrawerAdd(false)} dispatch={dispatch} />
        </MSCustomizeDrawer>
      )}
      {openDrawerEdit && (
        <MSCustomizeDrawer
          openDrawer={openDrawerEdit}
          onClose={() => setOpenDrawerEdit(false)}
          width={'30%'}
          zIndex={1001}
          title={intl.formatMessage({ id: 'view.common_device.edit_zone' })}
          placement="right"
        >
          <EditZone />
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
