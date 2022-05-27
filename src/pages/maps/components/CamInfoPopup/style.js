import styled from 'styled-components';
export const Container = styled.div`
  height: auto;
  border-radius: 2rem;
  .camera-info__header {
    position: relative;
    height: 49%;
    &--loading {
      position: absolute;
      top: 50%;
      z-index: 10;
      width: 100%;
      height: 100%;
    }
    &-action {
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
      .middle {
        margin: 0 8px;
      }
    }
    .video-js {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: fill;
      border-radius: 8px;
    }
  }
  .camera-info__title {
    display: inline-block;
    width: 100%;
    padding: 1rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    background-color: rgba(108, 117, 125, 0.12156862745098039);
  }
  .camera-info__detail {
    height: 100%;
    margin-bottom: 0 !important;
    padding: 0 1rem !important;
    list-style-type: none;
    li {
      display: flex;
      align-items: center;
      padding-bottom: 1rem;
      font-weight: 150;
      font-size: 1.2rem;
    }
    &-desc {
      display: inline-block;
      margin-left: 10px;
      color: #d0e5ff;
      font-weight: 500;
      font-size: 12px;
      font-style: normal;
      line-height: 20px;
      opacity: 0.7;
    }
  }
`;
