import { PlusOutlined } from '@ant-design/icons';
import { Button, Empty, Form, Input } from 'antd';
import { connect } from 'dva';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { ProTableStyle } from '../../style';
import AddEditCameraCategory from './AddEditCameraCategory';

const TableType = ({ dispatch, listType, metadataType, type, loading }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [openDrawerAddEdit, setOpenDrawerAddEdit] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchParam, setSearchParam] = useState({
    page: metadataType?.page,
    size: metadataType?.size,
  });

  useEffect(() => {
    dispatch({
      type: 'cameraCategory/fetchAllType',
      payload: {
        page: metadataType?.page,
        size: metadataType?.size,
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

  const handleGetListType = (searchParam) => {
    dispatch({
      type: 'cameraCategory/fetchAllType',
      payload: searchParam,
    });
  };

  const onPaginationChange = (page, pageSize) => {
    const dataParam = Object.assign({ ...searchParam, page: page, size: pageSize });
    setSearchParam(dataParam);
    handleGetListType(dataParam);
  };

  const handleSearch = (e) => {
    const value = e.target.value.trim();
    const dataParam = Object.assign({ ...searchParam, page: 1, name: value });
    setSearchParam(dataParam);
    handleGetListType(dataParam);
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

  return (
    <>
      <ProTableStyle
        headerTitle={`${intl.formatMessage(
          {
            id: `view.map.camera_type`,
          },
          {
            cam: intl.formatMessage({
              id: 'camera',
            }),
          },
        )}`}
        rowKey="id"
        search={false}
        locale={{
          emptyText: <Empty description={intl.formatMessage({ id: 'view.ai_config.no_data' })} />,
        }}
        dataSource={listType}
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
                  allowClear
                  className="search-camera-category"
                  maxLength={255}
                  placeholder={intl.formatMessage(
                    {
                      id: `view.category.plsEnter_camera_type`,
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
            })} ${total} ${intl.formatMessage(
              {
                id: `view.map.camera_type`,
              },
              {
                cam: intl.formatMessage({
                  id: 'camera',
                }),
              },
            )}`,
          onChange: onPaginationChange,
          total: metadataType?.total,
          pageSize: metadataType?.size,
          current: metadataType?.page,
        }}
      />

      {openDrawerAddEdit && (
        <AddEditCameraCategory
          onClose={() => setOpenDrawerAddEdit(false)}
          dispatch={dispatch}
          selectedRecord={selectedRecord}
          openDrawer={openDrawerAddEdit}
          type={type}
          resetForm={resetForm}
          searchParam={searchParam}
          setSearchParam={setSearchParam}
        />
      )}
    </>
  );
};

function mapStateToProps(state) {
  const { metadataType, listType } = state.cameraCategory;
  return {
    loading: state.loading.models.cameraCategory,
    metadataType,
    listType,
  };
}

export default connect(mapStateToProps)(TableType);
