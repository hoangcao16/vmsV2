import { Empty, Form, Input, Tag } from 'antd';
import { connect } from 'dva';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { ProTableStyle } from '../../style';
import EditCamproxy from './EditCamproxy';

const TableCamproxy = ({ dispatch, list, metadata, loading }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
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

  const handleSearch = (e) => {
    const value = e.target.value.trim();
    const dataParam = Object.assign({
      ...searchParam,
      name: encodeURIComponent(value),
      page: 1,
      size: 10,
    });
    setSearchParam(dataParam);
    handleGetListCamproxy(dataParam);
  };

  const handleQuickSearchBlur = (event) => {
    const value = event.target.value.trim();
    form.setFieldsValue({
      searchValue: value,
    });
  };

  const handleQuickSearchPaste = (event) => {
    const value = event.target.value.trimStart();
    form.setFieldsValue({
      searchValue: value,
    });
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
        locale={{
          emptyText: <Empty description={intl.formatMessage({ id: 'view.ai_config.no_data' })} />,
        }}
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
            <Form className="bg-grey" form={form} layout="horizontal" autoComplete="off">
              <Form.Item name="searchValue">
                <Input.Search
                  allowClear
                  maxLength={255}
                  placeholder={intl.formatMessage(
                    { id: 'view.common_device.please_enter_camproxy_name' },
                    {
                      plsEnter: intl.formatMessage({
                        id: 'please_enter',
                      }),
                    },
                  )}
                  onChange={debounce(handleSearch, 1000)}
                  onPaste={handleQuickSearchPaste}
                  onBlur={handleQuickSearchBlur}
                />
              </Form.Item>
            </Form>
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
          searchParam={searchParam}
          setSearchParam={setSearchParam}
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
