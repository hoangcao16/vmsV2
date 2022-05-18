import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { useIntl } from 'umi';
import { connect } from 'dva';
import { ProTableStyle } from './style';

const AdministrativeUnit = ({ dispatch, list, metadata }) => {
  const intl = useIntl();

  useEffect(() => {
    dispatch({
      type: 'advision/fetchAll',
      payload: {
        size: metadata?.size,
        name: metadata?.name,
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
  ];

  return (
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
        pagination={{
          showSizeChanger: true,
          showTotal: (total) =>
            `${intl.formatMessage({
              id: 'view.camera.total',
            })} ${total}`,
          total: metadata?.total,
          pageSize: 10,
          current: metadata?.page,
        }}
      />
    </PageContainer>
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
