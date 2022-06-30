import { Permission } from '@/utils/PermissionCheck';
import { Button, Tooltip } from 'antd';
import { AiOutlineSetting } from 'react-icons/ai';
import { FiCamera, FiVideo } from 'react-icons/fi';
import styled from 'styled-components';
import { useIntl } from 'umi';

const CameraSlotControl = ({ isRecording = false, onCapture, onRecord, showPresetSetting }) => {
  const intl = useIntl();

  return (
    <StyledCameraControl>
      {/* <ListControl> */}
      <Permission permissionName="capture_video_cam">
        <Tooltip placement="left" title={intl.formatMessage({ id: 'view.user.record' })}>
          <StyledIcon
            icon={<FiVideo />}
            type="primary"
            isRecording={isRecording}
            onClick={(e) => {
              e.stopPropagation();
              onRecord();
            }}
          />
        </Tooltip>
      </Permission>
      <Permission permissionName="capture_img_cam">
        <Tooltip
          placement="left"
          title={intl.formatMessage({ id: 'view.storage.capture_snapshot' })}
        >
          <StyledIcon
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              onCapture();
            }}
            icon={<FiCamera />}
          />
        </Tooltip>
      </Permission>
      <Permission permissionName="setup_preset">
        <Tooltip title={intl.formatMessage({ id: 'view.live.preset_setting' })} placement="left">
          <StyledIcon
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              showPresetSetting();
            }}
            icon={<AiOutlineSetting />}
          />
        </Tooltip>
      </Permission>
      {/* </ListControl> */}
    </StyledCameraControl>
  );
};

const StyledCameraControl = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 32px;
  right: 0;
  .ant-btn-primary {
    position: absolute;
    top: 0;
    z-index: 1;
    margin-bottom: 10px;
    opacity: 1;
    transition: unset;
  }
`;

// export const ListControl = styled.div`
//   display: flex;
//   flex-direction: column;
//   width: 32px;
//   height: 100%;
// `;

const StyledIcon = styled(Button)`
  background-color: ${(prop) => prop.isRecording && '#f00'} !important;
  border-color: ${(prop) => prop.isRecording && '#f00'} !important;
  transition: all 0.25s linear;
  border-radius: 2px;
  border: 0;
  padding: 0;
  cursor: pointer;
  margin-bottom: 10px;
  z-index: 10;
  position: static !important;
`;

export default CameraSlotControl;
