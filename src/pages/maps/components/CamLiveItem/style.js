import styled from 'styled-components';
export const Container = styled.div`
  position: relative;
  &[data-type='fullsize'] {
    position: fixed !important;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    width: auto !important;
    height: 100vh !important;
    padding-top: 48px;

    .close-btn {
      top: 64px;
      right: 20px;
    }
    .fullsize-btn {
      top: 100px;
      right: 20px;
    }
  }
  .close-btn {
    position: absolute;
    top: 6px;
    right: 8px;
    z-index: 3;
  }
  .fullsize-btn {
    position: absolute;
    top: 42px;
    right: 8px;
    z-index: 3;
  }
  .video-stream {
    margin: 0 0 6px 0;
  }
  .map__live-slot-cam-name {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 24px;
    background: #000000;
    opacity: 0.8;
    span {
      margin-left: 12px;
      color: #fff;
      font-weight: 400;
      font-size: 12px;
      line-height: 20px;
      .anticon {
        margin-right: 12px;
      }
    }
  }
`;
export const StyledLoading = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;
