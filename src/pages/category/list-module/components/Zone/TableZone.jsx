import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { connect } from 'dva';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { ProTableStyle } from '../../style';
import AddEditZone from './AddEditZone';

const TableZone = ({ dispatch, list, metadata, loading }) => {
  const [form] = Form.useForm();
  const intl = useIntl();
  const [openDrawerAddEdit, setOpenDrawerAddEdit] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchParam, setSearchParam] = useState({
    page: metadata?.page,
    size: metadata?.size,
  });

  useEffect(() => {
    dispatch({
      type: 'zone/fetchAllZone',
      payload: {
        page: metadata?.page,
        size: metadata?.size,
      },
    });
  }, []);

  const handleGetListZone = (searchParam) => {
    dispatch({
      type: 'zone/fetchAllZone',
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
    handleGetListZone(dataParam);
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
    handleGetListZone(dataParam);
  };

  const resetForm = () => {
    form.setFieldsValue({ searchValue: '' });
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
        loading={loading}
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
          filter: (
            <Form className="bg-grey" form={form} layout="horizontal" autoComplete="off">
              <Form.Item name="searchValue">
                <Input.Search
                  maxLength={255}
                  placeholder={intl.formatMessage(
                    { id: 'view.common_device.please_enter_zone_name' },
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
          onChange: onPaginationChange,
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
          resetForm={resetForm}
          searchParam={searchParam}
          setSearchParam={setSearchParam}
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
