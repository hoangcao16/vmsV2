import { SpanCode } from '@/pages/category/camera/components/GroupCameraDrawer/style';
import { Space, Table } from 'antd';
import { connect } from 'dva';
import { useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'umi';
import AddEditPreset from './preset/AddEditPreset';
import DetailsPreset from './preset/DetailsPreset';
function TablePreset({
  cameraSelected,
  listPreset,
  listPresetTour,
  dispatch,
  showDrawerAddEditPreset,
  showDrawerDetailsPreset,
  loading,
}) {
  const [openDetailsPreset, setOpenDetailsPreset] = useState(false);

  const intl = useIntl();

  const handleShowAddEditPreset = () => {
    dispatch({ type: 'showDrawer/openDrawerAddEditPreset', payload: { selectedPreset: null } });
  };

  const handleShowDetailsPreset = () => {
    setOpenDetailsPreset(true);
  };

  const columns = [
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
        id: 'pages.setting-user.list-user.camera',
      }),
      dataIndex: 'name',
    },

    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.option',
      }),
      fixed: 'right',
      width: '15%',
      render: (text, record) => {
        return <Space>{/* <EyeOutlined onClick={handleShowDetailsPreset} /> */}</Space>;
      },
    },
  ];

  const HeaderPreset = () => {
    return (
      <StyledHeader>
        <h3>Danh sách preset</h3>
        <SpanCode onClick={handleShowAddEditPreset}>+ Thêm preset</SpanCode>
      </StyledHeader>
    );
  };

  return (
    <div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={listPreset}
        pagination={{ pageSize: 10 }}
        title={() => <HeaderPreset />}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              dispatch({
                type: 'showDrawer/handleShowDrawerDetailsPreset',
                payload: { selectedPreset: record },
              });
            }, // click row
          };
        }}
      />
      {showDrawerAddEditPreset && (
        <AddEditPreset showDrawerAddEditPreset={showDrawerAddEditPreset} />
      )}
      {showDrawerDetailsPreset && (
        <DetailsPreset showDrawerDetailsPreset={showDrawerDetailsPreset} />
      )}
    </div>
  );
}

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

function mapStateToProps(state) {
  const { cameraSelected, listPreset, listPresetTour, loading } = state.live;

  const { showDrawerAddEditPreset, showDrawerDetailsPreset } = state.showDrawer;

  return {
    cameraSelected,
    listPreset,
    listPresetTour,
    showDrawerAddEditPreset,
    showDrawerDetailsPreset,
    loading,
  };
}

export default connect(mapStateToProps)(TablePreset);
