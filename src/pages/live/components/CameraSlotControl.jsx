import { Permission } from '@/utils/PermissionCheck';
import { Button, Tooltip } from 'antd';
import { useState } from 'react';
import { AiOutlineSetting } from 'react-icons/ai';
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
  showPresetSetting,
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
            <Tooltip placement="left" title={intl.formatMessage({ id: 'view.user.record' })}>
              <StyledIcon
                isRecording={isRecording}
                onClick={(e) => {
                  e.stopPropagation();
                  onRecord();
                }}
              >
                <FiVideo />
              </StyledIcon>
            </Tooltip>
          </Permission>
          <Permission permissionName="capture_img_cam">
            <Tooltip
              placement="left"
              title={intl.formatMessage({ id: 'view.storage.capture_snapshot' })}
            >
              <StyledIcon
                onClick={(e) => {
                  e.stopPropagation();
                  onCapture();
                }}
              >
                <FiCamera />
              </StyledIcon>
            </Tooltip>
          </Permission>
          <StyledTooltip
            placement="left"
            title={intl.formatMessage({
              id: zoomIn ? 'view.live.view_zoom_out' : 'view.live.view_fullscreen',
            })}
          >
            <StyledIcon
              onClick={(e) => {
                e.stopPropagation();
                onZoom();
              }}
            >
              {zoomIn ? <TbArrowsDiagonalMinimize /> : <TbArrowsDiagonal />}
            </StyledIcon>
          </StyledTooltip>
          <Permission permissionName="setup_preset">
            <Tooltip
              title={intl.formatMessage({ id: 'view.live.preset_setting' })}
              placement="left"
            >
              <StyledIcon
                onClick={(e) => {
                  e.stopPropagation();
                  showPresetSetting();
                }}
              >
                <AiOutlineSetting />
              </StyledIcon>
            </Tooltip>
          </Permission>
          <Tooltip placement="left" title={intl.formatMessage({ id: 'view.live.close_camera' })}>
            <StyledIcon
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              <FiX size={16} />
            </StyledIcon>
          </Tooltip>
        </ListControl>
      )}
      <Button type="primary" size="small" className="btn-type">
        <Type />
      </Button>
    </StyledCameraControl>
  );
};

const StyledCameraControl = styled.div`
  z-index: 12;
  position: absolute;
  display: flex;
  flex-direction: column-reverse;
  top: 15px;
  right: 15px;
  align-items: center;
  .ant-btn-primary {
    position: absolute;
    top: 0;
    z-index: 1;
    margin-bottom: 10px;
    opacity: 1;
    transition: unset;
  }
  align-items: center;
  justify-content: center;
  height: calc(100% - 30px);
`;

export const ListControl = styled.div`
  display: flex;
  flex-direction: column;
  opacity: 0;
  width: 32px;
  height: 100%;
`;

const StyledIcon = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 32px;
  max-height: 32px;
  width: 100%;
  height: calc(20% - 10px);
  background-color: ${(prop) => (prop.isRecording ? '#1890ff' : '#fff')};
  transition: all 0.25s linear;
  border-radius: 2px;

  border: 0;
  padding: 0;
  cursor: pointer;
  margin-bottom: 10px;
  z-index: 10;

  &:hover {
    background-color: #1890ff;
  }
  svg {
    width: auto;
    height: 70%;
    max-height: 16px;
  }
`;

const StyledTooltip = styled(Tooltip)`
  .ant-tooltip-content {
    width: 3000px;
    height: 200px !important;
  }
`;

export default CameraSlotControl;
