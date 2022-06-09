import styled from 'styled-components';
export const LeftSider = styled.div`
  &[data-type='collapsed'] {
    width: 46px;
    .close-btn,
    .fullsize-btn,
    .map__live-slot-cam-name,
    .save-btn,
    .emptycamera {
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
  .right-action {
    height: 100%;
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
export const EmptyCameraStyled = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .desc {
    margin: 24px 0;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
  }
`;
