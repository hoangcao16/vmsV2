import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import styled from 'styled-components';

const SeekControl = () => {
  return (
    <StyledSeekControl>
      <StyledButton icon={<MinusOutlined />} />
      <StyledListMarkerWrapper>
        <StyledListMarkerContent>
          <StyledMarkerItem />
          <StyledMarkerItem />
          <StyledMarkerItem />
          <StyledMarkerItem />
          <StyledMarkerItem mark="middle" />
          <StyledMarkerItem />
          <StyledMarkerItem />
          <StyledMarkerItem />
          <StyledMarkerItem />
          <StyledMarkerItem mark="max">
            <StyledMarkerItemHour>00:00</StyledMarkerItemHour>
            <StyledMarkerItemDate>16/05</StyledMarkerItemDate>
          </StyledMarkerItem>
          <StyledMarkerItem />
          <StyledMarkerItem />
          <StyledMarkerItem />
          <StyledMarkerItem />
          <StyledMarkerItem mark="middle" />
          <StyledMarkerItem />
          <StyledMarkerItem />
          <StyledMarkerItem />
          <StyledMarkerItem />
          <StyledMarkerItem mark="max">
            <StyledMarkerItemHour>01:00</StyledMarkerItemHour>
            <StyledMarkerItemDate>16/05</StyledMarkerItemDate>
          </StyledMarkerItem>
        </StyledListMarkerContent>
        <StyledMarkerTime>
          <StyledMarkerTimeItem>00:00</StyledMarkerTimeItem>
        </StyledMarkerTime>
      </StyledListMarkerWrapper>
      <StyledButton icon={<PlusOutlined />} />
    </StyledSeekControl>
  );
};

const StyledSeekControl = styled.div`
  height: 64px;
  display: flex;
  background: #003a8c60;
`;
const StyledButton = styled(Button)`
  &.ant-btn-icon-only {
    width: 24px;
    height: 100%;
    background: #003a8c;
    border-color: #003a8c50;
  }
`;

const StyledListMarkerWrapper = styled.div`
  position: relative;
  flex: 1;
  overflow: hidden;
`;

const StyledListMarkerContent = styled.div`
  display: flex;
  height: 100%;
`;

const StyledMarkerTime = styled.div`
  width: 16px;
  height: 100%;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background: #096dd930;

  &::after {
    position: absolute;
    top: 0;
    left: 50%;
    width: 4px;
    height: 100%;
    background: #1890ff;
    transform: translateX(-50%);
    content: '';
  }
`;

const StyledMarkerTimeItem = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 0px;
  width: 60px;
  height: 30px;
  background: #434343;
  border-radius: 2px;
  left: 50%;
  transform: translateX(-50%);
  bottom: 5px;
  z-index: 10;
`;

const markHeight = {
  middle: 10,
  max: 16,
};

const StyledMarkerItem = styled.div`
  position: relative;
  height: 100%;
  margin: 0 4px;

  &::after {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: ${(prop) => (prop.mark ? markHeight[prop.mark] || 6 : 6)}px;
    border-right: 2px solid currentColor;
    transform: translate(-50%, -50%);
    content: '';
    --darkreader-inline-fill: currentColor;
  }
`;
const StyledMarkerItemHour = styled.p`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
`;
const StyledMarkerItemDate = styled.p`
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  margin: 0;
`;

export default SeekControl;
