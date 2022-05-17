import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { ProTableStyle } from '../../style';
import AddEditZone from './AddEditZone';

const TableZone = ({ dispatch, list, metadata }) => {
  const intl = useIntl();
  const [openDrawerAddEdit, setOpenDrawerAddEdit] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

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
      width: '6%',
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
      width: '34%',
    },
  ];
  return (
    <>
      <ProTableStyle
        headerTitle={`${intl.formatMessage({
          id: 'view.common_device.zone_list',
        })}`}
        rowKey="id"
        search={false}
        dataSource={list}
        columns={columns}
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
                setOpenDrawerAddEdit(true);
                setSelectedRecord(null);
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
          showTotal: (total) =>
            `${intl.formatMessage({
              id: 'view.camera.total',
            })} ${total} Zone`,
          total: metadata?.total,
          pageSize: metadata?.size,
          current: metadata?.page,
        }}
      />

      {openDrawerAddEdit && (
        <AddEditZone
          onClose={() => setOpenDrawerAddEdit(false)}
          dispatch={dispatch}
          selectedRecord={selectedRecord}
          openDrawer={openDrawerAddEdit}
        />
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
