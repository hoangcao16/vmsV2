import styled from 'styled-components';
export const LeftSider = styled.div`
  &[data-type='collapsed'] {
    width: 40px;
    .close-btn,
    .fullsize-btn,
    .map__live-slot-cam-name {
      display: none;
    }
  }
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 5;
  justify-content: center;
  width: 344px;
  padding: 10px;
  background: #fff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  transition: all 0.5s;
  position: absolute;
`;
export const HeaderSider = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: 42px;
  .title {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    &[data-type='collapsed'] {
      display: none;
    }
  }

  .ant-btn {
    border: none;
    outline: none !important;
    box-shadow: none !important;
    &:not([disabled]):active {
      outline: none !important;
      box-shadow: none !important;
    }
  }
`;
