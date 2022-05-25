import {
  BackwardOutlined,
  CaretRightOutlined,
  ForwardOutlined,
  PauseOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { Button, DatePicker, Select, Space, TimePicker } from 'antd';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'umi';
import SeekControl from './SeekControl';

const PlaybackControl = () => {
  return (
    <StyledPlaybackControl>
      <StyledTopControl>
        <StyledSpace size={24}>
          <StyledText>
            <FormattedMessage id="view.maps.select_date" />
          </StyledText>
          <DatePicker />
          <StyledText>
            <FormattedMessage id="view.maps.select_time" />
          </StyledText>
          <TimePicker />
        </StyledSpace>
        <StyledSpace justifyContent="center" size={25}>
          <StyledControlButton icon={<BackwardOutlined />} shape="circle" />
          <StyledControlButton playButton icon={<CaretRightOutlined />} shape="circle" />
          <StyledControlButton icon={<ForwardOutlined />} shape="circle" />
        </StyledSpace>
        <StyledRightControl>
          <Space size={10}>
            <StyledText>
              <FormattedMessage id="pages.live-mode.speed" />
            </StyledText>
            <Select value="X1"></Select>
          </Space>
          <StyledText>{moment().format('LTS')}</StyledText>
        </StyledRightControl>
      </StyledTopControl>
      <SeekControl />
    </StyledPlaybackControl>
  );
};

const StyledPlaybackControl = styled.div`
  height: 140px;
  background: #1f1f1f;
  margin-bottom: 8px;
`;

const StyledTopControl = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
`;

const StyledSpace = styled(Space)`
  flex: 1;
  justify-content: ${(prop) => prop.justifyContent || 'start'};
`;

const StyledText = styled.p`
  margin-bottom: 0;
`;

const StyledRightControl = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
`;

const StyledControlButton = styled(Button)`
  &.ant-btn-icon-only {
    width: 36px;
    height: 36px;
  }

  ${(prop) =>
    prop.playButton &&
    `
      &.ant-btn-icon-only {
      width: 48px;
      height: 48px;
    }`}
`;

export default PlaybackControl;
