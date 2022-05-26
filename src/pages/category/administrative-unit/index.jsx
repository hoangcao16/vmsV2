import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { connect } from 'dva';
import { ProTableStyle } from './style';
import { AutoComplete, Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AddEditAdministrativeUnit from './components/AddEditAdministrativeUnit';
import { debounce } from 'lodash';

const AdministrativeUnit = ({ dispatch, list, metadata, loading }) => {
  const intl = useIntl();
  const [openDrawerAddEdit, setOpenDrawerAddEdit] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    dispatch({
      type: 'advision/fetchAll',
      payload: {
        size: metadata?.size,
        name: metadata?.name,
        page: 1,
      },
    });
  }, []);

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

  const handleSearch = (value) => {
    dispatch({
      type: 'advision/fetchAll',
      payload: {
        size: metadata?.size,
        name: value,
      },
    });
  };

  return (
    <>
      <PageContainer>
        <ProTableStyle
          headerTitle={`${intl.formatMessage({
            id: 'view.category.administrative_unit',
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
            pageSize: metadata.size,
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
