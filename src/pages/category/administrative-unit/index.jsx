import AdDivisionApi from '@/services/advisionApi';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Empty, Form, Input } from 'antd';
import { connect } from 'dva';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import AddEditAdministrativeUnit from './components/AddEditAdministrativeUnit';
import { ProTableStyle } from './style';

const AdministrativeUnit = ({ dispatch, list, metadata, loading }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [openDrawerAddEdit, setOpenDrawerAddEdit] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchParam, setSearchParam] = useState({
    page: metadata?.page,
    size: metadata?.size,
  });

  const columns = [
    {
      title: intl.formatMessage({
        id: 'view.category.no',
      }),
      key: 'index',
      width: '15%',
      render: (text, record, index) => index + 1,
    },
    {
      title: intl.formatMessage({
        id: 'view.category.administrative_unit',
      }),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'view.map.address',
      }),
      dataIndex: 'address',
      key: 'address',
      width: '30%',
    },
  ];

  const handleGetListAdvision = (searchParam) => {
    dispatch({
      type: 'advision/fetchAll',
      payload: searchParam,
    });
  };

  const handleSearch = (e) => {
    const value = e.target.value.trim();
    const dataParam = Object.assign({
      ...searchParam,
      name: value,
      page: 1,
    });
    setSearchParam(dataParam);
    handleGetListAdvision(dataParam);
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
    handleGetListAdvision(dataParam);
  };

  useEffect(() => {
    dispatch({
      type: 'advision/fetchAll',
      payload: {
        page: metadata?.page,
        size: metadata?.size,
      },
    });
  }, []);

  const resetForm = () => {
    form.setFieldsValue({ searchValue: '' });
  };

  return (
    <>
      <PageContainer>
        <ProTableStyle
          headerTitle={`${intl.formatMessage({
            id: 'view.category.administrative_unit',
          })}`}
          rowKey="uuid"
          search={false}
          dataSource={list}
          loading={loading}
          locale={{
            emptyText: <Empty description={intl.formatMessage({ id: 'view.ai_config.no_data' })} />,
          }}
          columns={columns}
          options={false}
          onRow={(record) => {
            return {
              onClick: async () => {
                await AdDivisionApi.getAdDivisionByUuid(record.uuid).then((data) => {
                  setSelectedRecord(data?.payload);
                });
                setOpenDrawerAddEdit(true);
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
                      { id: 'view.category.plsEnter_administrative_unit_name' },
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
                {intl.formatMessage({ id: 'view.camera.add_new' })}
              </Button>,
            ],
          }}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) =>
              `${intl.formatMessage({
                id: 'view.camera.total',
              })} ${total} ${intl.formatMessage({
                id: `view.category.administrative_unit`,
              })}`,
            total: metadata?.total,
            onChange: onPaginationChange,
            pageSize: metadata?.size,
            current: metadata?.page,
          }}
        />
      </PageContainer>
      {openDrawerAddEdit && (
        <AddEditAdministrativeUnit
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
  const { list, metadata } = state.advision;
  return {
    loading: state.loading.models.advision,
    list,
    metadata,
  };
}

export default connect(mapStateToProps)(AdministrativeUnit);
