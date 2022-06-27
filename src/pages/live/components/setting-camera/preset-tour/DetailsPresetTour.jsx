import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Space, Table } from 'antd';
import styled from 'styled-components';
import { useIntl } from 'umi';

import { StyledDrawer } from '@/pages/live/style';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import CameraSlot from '../../CameraSlot';

export const TABS = {
  SETTING: '1',
  CHANGE_PRESET: '2',
  CONTROL: '3',
};

function DetailsPresetTour({
  showDrawerDetailsPresetTour,
  selectedPresetTour,
  cameraSelected,
  dispatch,
  loading,
}) {
  const intl = useIntl();

  const handleCloseDetailsPresetTour = () => {
    dispatch({ type: 'showPresetTourDrawer/closeDrawerDetailsPresetTour' });
  };
  const handleDeletePresetTour = () => {
    const body = {
      cameraUuid: cameraSelected?.uuid,
      idPreset: selectedPresetTour?.idPresetTour,
    };

    dispatch({ type: 'showPresetTourDrawer/deletePresetTour', payload: { body } });
  };
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
      title: 'Tên preset',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'Người tạo',
      dataIndex: 'userName',
      key: 'userName',
      width: '30%',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: '30%',
    },
  ];

  return (
    <StyledDrawer
      openDrawer={showDrawerDetailsPresetTour}
      onClose={handleCloseDetailsPresetTour}
      width={'80%'}
      zIndex={1001}
      placement="right"
      extra={
        <Space>
          <Button
            type="primary"
            onClick={() => {
              dispatch({ type: 'showPresetTourDrawer/editPresetTour' });
            }}
          >
            <EditOutlined />
            {intl.formatMessage({ id: 'view.map.button_edit' })}
          </Button>

          <Button onClick={handleDeletePresetTour}>
            <DeleteOutlined />
            {intl.formatMessage({ id: 'view.map.delete' })}
          </Button>
        </Space>
      }
    >
      <h3> Xem chi tiết preset tour</h3>
      <h4>{selectedPresetTour?.name}</h4>
      <StyledDivider />
      <h4>Tên preset: {selectedPresetTour?.name}</h4>
      <h4>Tên Camera: {selectedPresetTour?.cameraName}</h4>
      <h4>Thời lượng: {selectedPresetTour?.cameraName}</h4>
      <h4>Ngày tạo: {new Date(selectedPresetTour?.createdTime).getTime()}</h4>
      <h4>Người tạo: {selectedPresetTour?.userName}</h4>
      <StyledDivider />
      <h3>Danh sách Preset:</h3>
      <Table
        loading={loading}
        columns={columns}
        dataSource={selectedPresetTour?.listPoint}
        pagination={{ pageSize: 10 }}
      />
      <h3>Xem preset tour:</h3>
      <CameraContent>
        {!isEmpty(cameraSelected) && <CameraSlot camera={cameraSelected} inPresetView />}
      </CameraContent>
    </StyledDrawer>
  );
}

const CameraContent = styled.div`
  position: relative;
  width: 100%;
  height: 500px !important;
  top: 0;
  left: 0;

  .ant-drawer-body video {
    height: 100% !important;
  }
`;

const StyledDivider = styled(Divider)`
  margin-bottom: 0px;
`;

function mapStateToProps(state) {
  const { selectedPresetTour, loading } = state.showPresetTourDrawer;
  const { cameraSelected } = state.live;

  return {
    selectedPresetTour,
    cameraSelected,
    loading,
  };
}

export default connect(mapStateToProps)(DetailsPresetTour);
