import { Permission } from '@/utils/PermissionCheck';
import { Button, Tooltip } from 'antd';
import { FiCamera, FiVideo, FiX } from 'react-icons/fi';
import { TbArrowsDiagonal, TbArrowsDiagonalMinimize } from 'react-icons/tb';
import styled from 'styled-components';
import { useIntl } from 'umi';

const CameraSlotControl = ({
  camera,
  showControl = true,
  isRecording = false,
  onCapture,
  onRecord,
  onClose,
  mode,
  zoomIn,
  onZoom,
  ...props
}) => {
  const intl = useIntl();

  const Type = () => {
    switch (mode) {
      case 'live':
        return 'Live';
      case 'play':
        return 'Play';
      default:
        return '';
    }
  };

  return (
    <StyledCameraControl>
      {showControl && (
        <ListControl className={props.className} zoomIn={zoomIn}>
          <Permission permissionName="capture_video_cam">
            <Tooltip title={intl.formatMessage({ id: 'view.user.record' })}>
              <StyledIcon isRecording={isRecording} onClick={onRecord}>
                <FiVideo size={12} />
              </StyledIcon>
            </Tooltip>
          </Permission>
          <Permission permissionName="capture_img_cam">
            <Tooltip title={intl.formatMessage({ id: 'view.storage.capture_snapshot' })}>
              <StyledIcon onClick={onCapture}>
                <FiCamera size={12} />
              </StyledIcon>
            </Tooltip>
          </Permission>
          <Tooltip
            trigger="hover"
            title={intl.formatMessage({
              id: zoomIn ? 'view.live.view_zoom_out' : 'view.live.view_fullscreen',
            })}
          >
            <StyledIcon onClick={onZoom}>
              {zoomIn ? <TbArrowsDiagonalMinimize size={12} /> : <TbArrowsDiagonal size={12} />}
            </StyledIcon>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'view.live.close_camera' })}>
            <StyledIcon onClick={onClose}>
              <FiX size={12} />
            </StyledIcon>
          </Tooltip>
        </ListControl>
      )}
      <Button type="primary" size="small">
        <Type />
      </Button>
    </StyledCameraControl>
  );
};

const StyledCameraControl = styled.div`
  z-index: 12;
  position: absolute;
  display: flex;
  top: 15px;
  right: 15px;
  align-items: center;
  .ant-btn-primary {
    z-index: 1;
  }
`;

const ListControl = styled.div`
  display: flex;
  margin-right: 10px;
  visibility: hidden;
`;

const StyledIcon = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: ${(prop) => (prop.isRecording ? '#1890ff' : '#fff')};
  border: 0;
  padding: 0;
  border-radius: 50%;
  cursor: pointer;
  margin-left: 10px;
  z-index: 10;

  &:hover {
    background-color: #1890ff;
  }
`;

export default CameraSlotControl;
