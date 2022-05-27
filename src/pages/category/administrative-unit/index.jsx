import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { AutoComplete, Button, Input } from 'antd';
import { connect } from 'dva';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import AddEditAdministrativeUnit from './components/AddEditAdministrativeUnit';
import { ProTableStyle } from './style';

const AdministrativeUnit = ({ dispatch, list, metadata, loading }) => {
  const intl = useIntl();
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

  const handleSearch = (value) => {
    const dataParam = Object.assign({
      ...searchParam,
      name: value,
      page: 1,
      size: 10,
    });
    setSearchParam(dataParam);
    handleGetListAdvision(dataParam);
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
            filter: (
              <AutoComplete key="search" onSearch={debounce(handleSearch, 1000)}>
                <Input.Search
                  placeholder={intl.formatMessage(
                    { id: 'view.category.plsEnter_administrative_unit_name' },
                    {
                      plsEnter: intl.formatMessage({
                        id: 'please_enter',
                      }),
                    },
                  )}
                />
              </AutoComplete>
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
              })} ${total}`,
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
