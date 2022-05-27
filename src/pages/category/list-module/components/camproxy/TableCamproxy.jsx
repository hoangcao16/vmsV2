import { AutoComplete, Input, Tag } from 'antd';
import { connect } from 'dva';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { ProTableStyle } from '../../style';
import EditCamproxy from './EditCamproxy';

const TableCamproxy = ({ dispatch, list, metadata, loading }) => {
  const intl = useIntl();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedCamproxyEdit, setSelectedCamproxyEdit] = useState(null);
  const [searchParam, setSearchParam] = useState({
    page: metadata?.page,
    size: metadata?.size,
  });

  useEffect(() => {
    dispatch({
      type: 'camproxy/fetchAllCamproxy',
      payload: {
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

  const handleGetListCamproxy = (searchParam) => {
    dispatch({
      type: 'camproxy/fetchAllCamproxy',
      payload: searchParam,
    });
  };

  const handleSearch = (value) => {
    const dataParam = Object.assign({ ...searchParam, name: value, page: 1, size: 10 });
    setSearchParam(dataParam);
    handleGetListCamproxy(dataParam);
  };

  const onPaginationChange = (page, size) => {
    const dataParam = Object.assign({ ...searchParam, page, size });
    setSearchParam(dataParam);
    handleGetListCamproxy(dataParam);
  };

  const renderTag = (cellValue) => {
    return (
      <Tag color={cellValue === 'UP' ? '#1380FF' : '#FF4646'}>
        {intl.formatMessage({
          id: `view.camera.${cellValue === 'UP' ? 'active' : 'inactive'}`,
        })}
      </Tag>
    );
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
        id: 'view.common_device.camproxy_name',
      }),
      dataIndex: 'name',
      key: 'name',
      width: '24%',
    },
    {
      title: intl.formatMessage({
        id: 'view.common_device.desc',
      }),
      dataIndex: 'description',
      key: 'description',
      width: '25%',
    },
    {
      title: intl.formatMessage({
        id: 'view.common_device.note',
      }),
      dataIndex: 'note',
      key: 'note',
      width: '25%',
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
  ];
  return (
    <>
      <ProTableStyle
        headerTitle={`${intl.formatMessage({
          id: 'view.common_device.camproxy_list',
        })}`}
        rowKey="id"
        search={false}
        dataSource={list}
        columns={columns}
        options={false}
        loading={loading}
        onRow={(record) => {
          return {
            onClick: () => {
              showDrawer();
              setSelectedCamproxyEdit(record);
            },
          };
        }}
        toolbar={{
          multipleLine: true,
          filter: (
            <AutoComplete key="search" onSearch={debounce(handleSearch, 1000)}>
              <Input.Search
                placeholder={intl.formatMessage(
                  { id: 'view.common_device.please_enter_camproxy_name' },
                  {
                    plsEnter: intl.formatMessage({
                      id: 'please_enter',
                    }),
                  },
                )}
              />
            </AutoComplete>
          ),
        }}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) =>
            `${intl.formatMessage({
              id: 'view.camera.total',
            })} ${total} Camproxy`,
          onChange: onPaginationChange,
          total: metadata?.total,
          pageSize: metadata?.size,
          current: metadata?.page,
        }}
      />
      {openDrawer && (
        <EditCamproxy
          selectedCamproxyEdit={selectedCamproxyEdit}
          onClose={onClose}
          dispatch={dispatch}
          openDrawer={openDrawer}
        />
      )}
    </>
  );
};

function mapStateToProps(state) {
  const { list, metadata } = state.camproxy;
  return {
    loading: state.loading.models.camproxy,
    list,
    metadata,
  };
}
export default connect(mapStateToProps)(TableCamproxy);
