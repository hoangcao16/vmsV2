import { Permission } from '@/utils/PermissionCheck';
import { FiCamera, FiVideo, FiX } from 'react-icons/fi';
import { Button, Tooltip } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'umi';

const CameraSlotControl = ({
  camera,
  showControl = true,
  isRecording = false,
  onCapture,
  onRecord,
  onClose,
  ...props
}) => {
  const intl = useIntl();

  const Type = () => {
    switch (camera?.type) {
      case 'live':
        return 'Live';
      default:
        return '';
    }
  };

  return (
    <StyledCameraControl>
      {showControl && (
        <ListControl className={props.className}>
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
  position: absolute;
  display: flex;
  top: 15px;
  right: 15px;
  align-items: center;
  z-index: 999;
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

  &:hover {
    background-color: #1890ff;
  }
`;

export default CameraSlotControl;
