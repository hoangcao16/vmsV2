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
            {intl.formatMessage({ id: 'view.map.button_edit' })}
          </Button>

          <Button onClick={handleDeletePreset}>
            <DeleteOutlined />
            {intl.formatMessage({ id: 'view.map.delete' })}
          </Button>
        </Space>
      }
    >
      <h3> Xem chi tiết preset</h3>
      <h4>{selectedPreset?.name}</h4>
      <StyledDivider />

      <h4>Tên preset: {selectedPreset?.name}</h4>
      <h4>Tên Camera: {selectedPreset?.cameraName}</h4>
      <h4>Ngày tạo: {new Date(selectedPreset?.createdTime).getTime()}</h4>
      <h4>Người tạo: {selectedPreset?.userName}</h4>

      <StyledDivider />

      <h3>Xem preset:</h3>

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
  const { selectedPreset } = state.showDrawer;
  const { cameraSelected } = state.live;

  return {
    selectedPreset,
    cameraSelected,
  };
}

export default connect(mapStateToProps)(DetailsPreset);
