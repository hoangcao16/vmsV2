import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
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

function DetailsPreset({ openDetailsPreset, onCloseDrawerDetails, cameraSelected }) {
  const intl = useIntl();

  return (
    <StyledDrawer
      openDrawer={openDetailsPreset}
      onClose={onCloseDrawerDetails}
      width={'100%'}
      zIndex={1001}
      placement="right"
      extra={
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              // form.submit();
            }}
          >
            <SaveOutlined />
            {intl.formatMessage({ id: 'view.map.button_save' })}
          </Button>

          <Button onClick={onCloseDrawerDetails}>
            <CloseOutlined />
            {intl.formatMessage({ id: 'view.map.cancel' })}
          </Button>
        </Space>
      }
    >
      <h3> Thêm preset</h3>
      <h4>{cameraSelected?.name}</h4>
      <StyledDivider />

      <CameraContent>
        {!isEmpty(cameraSelected) && <CameraSlot camera={cameraSelected} />}
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
  const { cameraSelected } = state.live;

  return {
    cameraSelected,
  };
}

export default connect(mapStateToProps)(DetailsPreset);
