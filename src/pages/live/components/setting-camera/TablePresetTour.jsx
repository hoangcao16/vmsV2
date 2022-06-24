import { SpanCode } from '@/pages/category/camera/components/GroupCameraDrawer/style';
import { EyeOutlined } from '@ant-design/icons';
import { Space, Table } from 'antd';
import { connect } from 'dva';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'umi';
import AddEditPresetTour from './preset-tour/AddEditPresetTour';
function TablePresetTour({
  cameraSelected,
  listPreset,
  listPresetTour,
  dispatch,
  showDrawerAddEditPresetTour,
}) {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const intl = useIntl();

  const handleShowAddEditPresetTour = () => {
    dispatch({
      type: 'showPresetTourDrawer/openDrawerAddEditPresetTour',
      payload: { selectedPresetTour: null },
    });
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
        return (
          <Space>
            <EyeOutlined />
          </Space>
        );
      },
    },
  ];

  const HeaderPresetTour = () => {
    return (
      <StyledHeader>
        <h3>Danh sách preset tour</h3>
        <SpanCode onClick={handleShowAddEditPresetTour}>+ Thêm preset tour</SpanCode>
      </StyledHeader>
    );
  };

  return (
    <div>
      <Table
        columns={columns}
        dataSource={listPresetTour}
        pagination={{ pageSize: 10 }}
        title={() => <HeaderPresetTour />}
      />
      {showDrawerAddEditPresetTour && (
        <AddEditPresetTour showDrawerAddEditPresetTour={showDrawerAddEditPresetTour} />
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
  const { listPreset, listPresetTour } = state.live;

  const { showDrawerAddEditPresetTour } = state.showPresetTourDrawer;

  return {
    listPreset,
    listPresetTour,
    showDrawerAddEditPresetTour,
  };
}

export default connect(mapStateToProps)(TablePresetTour);
