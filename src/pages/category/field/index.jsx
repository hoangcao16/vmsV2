import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Form, Input } from 'antd';
import { connect } from 'dva';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import AddEditField from './components/AddEditField';
import { ProTableStyle } from './style';

const Field = ({ dispatch, list, metadata, loading }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [openDrawerAddEdit, setOpenDrawerAddEdit] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchParam, setSearchParam] = useState({
    page: metadata?.page,
    size: metadata?.size,
  });

  useEffect(() => {
    dispatch({
      type: 'field/fetchAllField',
      payload: {
        page: metadata?.page,
        size: metadata?.size,
      },
    });
  }, []);

  const categoryColumns = [
    {
      title: intl.formatMessage({
        id: 'view.storage.NO',
      }),
      key: 'index',
      width: '15%',
      render: (text, record, index) => index + 1,
    },

    {
      title: intl.formatMessage({
        id: 'view.category.category_name',
      }),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
  ];

  const handleGetListField = (searchParam) => {
    dispatch({
      type: 'field/fetchAllField',
      payload: searchParam,
    });
  };

  const handleSearch = (e) => {
    const value = e.target.value.trim();
    const dataParam = Object.assign({ ...searchParam, page: 1, name: value });
    setSearchParam(dataParam);
    handleGetListField(dataParam);
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

  const resetForm = () => {
    form.setFieldsValue({ searchValue: '' });
  };

  const onPaginationChange = (page, pageSize) => {
    const dataParam = Object.assign({ ...searchParam, page: page, size: pageSize });
    setSearchParam(dataParam);
    handleGetListField(dataParam);
  };

  return (
    <>
      <PageContainer>
        <ProTableStyle
          headerTitle={`${intl.formatMessage({
            id: `view.category.field`,
          })}`}
          rowKey="id"
          search={false}
          dataSource={list}
          loading={loading}
          columns={categoryColumns}
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
            filter: (
              <Form className="bg-grey" form={form} layout="horizontal" autoComplete="off">
                <Form.Item name="searchValue">
                  <Input.Search
                    className="search-camera-category"
                    maxLength={255}
                    placeholder={intl.formatMessage(
                      {
                        id: `view.category.plsEnter_field`,
                      },
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
                {intl.formatMessage({ id: 'add' })}
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
                id: `view.category.field`,
              })}`,
            onChange: onPaginationChange,
            total: metadata?.total,
            pageSize: metadata?.size,
            current: metadata?.page,
          }}
        />
      </PageContainer>
      {openDrawerAddEdit && (
        <AddEditField
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
  const { metadata, list } = state.field;
  return {
    loading: state.loading.models.field,
    metadata,
    list,
  };
}

export default connect(mapStateToProps)(Field);
