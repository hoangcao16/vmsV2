import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Space, Table, Empty } from 'antd';
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
      title: 'Preset',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.live-mode.noti.user-create' }),
      dataIndex: 'userName',
      key: 'userName',
      width: '30%',
    },
    {
      title: intl.formatMessage({ id: 'view.storage.created_time' }),
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
            {intl.formatMessage({ id: 'pages.live-mode.noti.button-edit' })}
          </Button>

          <Button onClick={handleDeletePresetTour}>
            <DeleteOutlined />
            {intl.formatMessage({ id: 'pages.live-mode.noti.button-devele' })}
          </Button>
        </Space>
      }
    >
      <h3>{intl.formatMessage({ id: 'pages.live-mode.noti.details-preset-tour' })}</h3>
      <h4>{selectedPresetTour?.name}</h4>
      <StyledDivider />
      <h4>Preset tour: {selectedPresetTour?.name}</h4>
      <h4>Camera: {selectedPresetTour?.cameraName}</h4>
      <h4>Time: {selectedPresetTour?.cameraName}</h4>
      <h4>
        {intl.formatMessage({ id: 'view.storage.created_time' })}:{' '}
        {new Date(selectedPresetTour?.createdTime).getTime()}
      </h4>
      <h4>
        {intl.formatMessage({ id: 'pages.live-mode.noti.user-create' })}:{' '}
        {selectedPresetTour?.userName}
      </h4>
      <StyledDivider />
      <h3>{intl.formatMessage({ id: 'view.live.menu_preset' })}:</h3>
      <Table
        loading={loading}
        columns={columns}
        locale={{
          emptyText: <Empty description={intl.formatMessage({ id: 'view.ai_config.no_data' })} />,
        }}
        dataSource={selectedPresetTour?.listPoint}
        pagination={{ pageSize: 10 }}
      />
      <h3>Preset tour:</h3>
      <CameraContent>
        {!isEmpty(cameraSelected) && (
          <CameraSlot camera={cameraSelected} uuid={cameraSelected.uuid} inPresetView />
        )}
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
