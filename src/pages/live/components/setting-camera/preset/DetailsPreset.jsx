import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Space } from 'antd';
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

function DetailsPreset({ showDrawerDetailsPreset, selectedPreset, cameraSelected, dispatch }) {
  const intl = useIntl();

  const handleCloseDetailsPreset = () => {
    dispatch({ type: 'showDrawer/closeDrawerDetailsPreset' });
  };
  const handleDeletePreset = () => {
    const body = {
      cameraUuid: cameraSelected?.uuid,
      idPreset: selectedPreset?.idPreset,
    };

    dispatch({ type: 'showDrawer/deletePreset', payload: { body } });
  };

  return (
    <StyledDrawer
      openDrawer={showDrawerDetailsPreset}
      onClose={handleCloseDetailsPreset}
      width={'80%'}
      zIndex={1001}
      placement="right"
      extra={
        <Space>
          <Button
            type="primary"
            onClick={() => {
              dispatch({ type: 'showDrawer/editPreset' });
            }}
          >
            <EditOutlined />
            {intl.formatMessage({ id: 'pages.live-mode.noti.button-edit' })}
          </Button>

          <Button onClick={handleDeletePreset}>
            <DeleteOutlined />
            {intl.formatMessage({ id: 'pages.live-mode.noti.button-delete' })}
          </Button>
        </Space>
      }
    >
      <h3> {intl.formatMessage({ id: 'pages.live-mode.noti.details-preset' })}</h3>
      <h4>{selectedPreset?.name}</h4>
      <StyledDivider />

      <h4>Preset: {selectedPreset?.name}</h4>
      <h4>Camera: {selectedPreset?.cameraName}</h4>
      <h4>
        {intl.formatMessage({ id: 'view.storage.created_time' })}:{' '}
        {new Date(selectedPreset?.createdTime).getTime()}
      </h4>
      <h4>
        {intl.formatMessage({ id: 'pages.live-mode.noti.user-create' })}: {selectedPreset?.userName}
      </h4>

      <StyledDivider />

      <h3> Preset:</h3>

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
  const { selectedPreset } = state.showDrawer;
  const { cameraSelected } = state.live;

  return {
    selectedPreset,
    cameraSelected,
  };
}

export default connect(mapStateToProps)(DetailsPreset);
