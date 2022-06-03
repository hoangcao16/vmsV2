import styled from 'styled-components';
import MSCustomizeDrawer from '@/components/Drawer';
import { Collapse, Row } from 'antd';

// $vms-status-07: rgba(208, 229, 255, 0.7);
// $vms-bg-sub: #333333;
// $vms-bg-3: #232323;
// $vms-blue: #1380ff;
// $vms-main-blue-primary: #1380ff;

export const MSCustomizeDrawerStyled = styled(MSCustomizeDrawer)`
  .ant-drawer-header {
    /* flex-direction: row-reverse; */
  }

  .ant-drawer-header-title {
    flex: none;
  }

  .headerCapture {
    padding: 20px 32px;
    color: rgba(255, 255, 255, 0.85);
    font-weight: 700;
  }
  .ant-drawer-body {
    padding: 0px;
  }
`;

export const CollapseStyled = styled(Collapse)`
  .ant-collapse-item {
    border-top: 1px solid #e8e8e8;

    .ant-collapse-header,
    .ant-collapse-content-box {
      padding-left: 24px;
    }
  }

  .detailInfo {
    display: flex;
    align-items: flex-start;

    margin-bottom: 16px;
  }

  .detailInfo-title {
    min-width: 130px;
  }

  .detailInfo-content {
    flex: 1;
  }

  .detailInfo-content__note {
    max-width: 395px;
  }
`;

export const HeaderPanelStyled = styled.div`
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
`;

export const ViewFileContainer = styled.div`
  border-top: 1px solid #e8e8e8;
  padding: 24px;

  .snapshotCanvas {
    display: none;
  }

  .screenView {
    min-height: 500px;
    background-color: #333333;

    .displayScreen {
      height: 100%;
      max-height: 500px;
      .iconPoster {
        width: 100%;
        height: 100%;
      }

      .iconPoster.hidden {
        display: none;
      }
    }

    .displayScreen.hidden {
      display: none;
    }

    .volume {
      display: flex;
      flex-flow: row-reverse;
      padding: 15px;
      -webkit-transform: rotate(-90deg);
      -moz-transform: rotate(-90deg);

      .max {
        display: flex;
        align-self: center;
        width: 20px;
        height: 20px;
        margin-left: 5px;
        -webkit-transform: rotate(90deg);
        -moz-transform: rotate(90deg);

        .icon {
          width: 20px;
          height: 20px;
          color: rgba(208, 229, 255, 0.7);
          cursor: pointer;
        }
      }

      .valueInProgress {
        margin-right: 3px;
        font-weight: 600;
        font-size: 12px;
        font-style: normal;
        line-height: 20px;
        -webkit-transform: rotate(90deg);
        -moz-transform: rotate(90deg);

        span {
          color: #1380ff;
        }
      }

      .min {
        display: flex;
        align-self: center;
        margin-right: 5px;
        -webkit-transform: rotate(90deg);
        -moz-transform: rotate(90deg);

        .icon {
          width: 20px;
          height: 20px;
          color: rgba(208, 229, 255, 0.7);
          cursor: pointer;
        }
      }

      .inProgress {
        display: flex;
        align-self: center;
        min-width: 30em;

        .inputRangeSlider {
          width: 100%;
          cursor: pointer;
        }
      }
    }
  }

  .playControl {
    margin: 15px 0;

    .watchBack {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      align-self: center;
      justify-content: center;
      width: 234px;
      height: 39px;
      color: #fafcff;
      background: #1380ff;
      border-radius: 4px;

      .icon {
        width: 20px;
        height: 20px;
      }

      .play {
        display: flex;
        flex: 0.7;
        justify-content: center;
        width: 40px;

        border-right-color: #fcfeff;
      }

      .border {
        height: 100%;
        border: 0.1px solid;
      }

      .viewOut {
        display: flex;
        flex: 2;

        .time {
          padding: 0 5px;
        }
      }

      .viewIn {
        flex: 2;

        .time {
          padding: 5px;
        }
      }
    }

    .actionControl {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      .playIconContainer,
      .playIconContainer__disabled {
        display: flex;
        width: 36px;
        height: 36px;
        margin: 10px 17px;
        background: #333333;
        border-radius: 36px;

        .playIcon {
          width: 18px;
          height: 18px;
          margin: auto;
          color: rgba(208, 229, 255, 0.7);
        }
      }

      .playIconContainer__disabled {
        .playIcon {
          color: #232323;
        }
      }

      .playIconContainer:hover {
        border: 1px solid #1380ff;
        cursor: pointer;
      }

      .playIcon2Container,
      .playIcon2Container__disabled {
        display: flex;
        width: 56px;
        height: 56px;
        background: #1380ff;
        border-radius: 36px;

        .playIcon2 {
          width: 28px;
          height: 28px;
          margin: auto;
          color: rgba(208, 229, 255, 0.7);
        }
      }

      .playIcon2Container__disabled {
        background: #333333;

        .playIcon2 {
          color: #232323;
        }
      }

      .playIcon2Container:hover {
        background: #3692fc;
        cursor: pointer;
      }
    }

    .captureContainer {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;

      .btn-action {
        display: flex;
        align-items: center;
      }

      .action {
        width: 24px;
        height: 24px;
        /* margin: 10px 7px; */
        margin-right: 10px;
        /* color: rgba(208, 229, 255, 0.7); */
      }

      .action__disabled {
        width: 24px;
        height: 24px;
        margin: 10px 7px;
        color: #333333;
      }

      .action:hover {
        color: #1380ff;
        cursor: pointer;
      }

      .ogLabel {
        width: 40px;
        height: 24px;
        margin: 10px 7px;
        padding-top: 1px;
        padding-left: 4px;
        color: #fff9f9;
        font-weight: bold;
        text-transform: uppercase;
        background-color: #ff9f43;
        cursor: pointer;
      }
    }
  }
`;

export const ContainerCapture = styled.div`
  border-top: 1px solid #e8e8e8;
  padding: 24px;
`;

export const StyledEventFileDetail = styled(Row)`
  width: 100%;
  margin-bottom: 12px;
  .detail-item {
    align-items: center;
    min-height: 40px;
    padding: 6px 0;
    color: #d0e5ff;
  }
  .title {
    color: #d0e5ff;
    font-weight: bold;
    font-size: 16px;
  }
  .err_image {
    margin-top: 8px;
    ul {
      display: flex;
      align-items: center;
      padding-left: 0 !important;
    }
  }
`;

export const VideoOverlay = styled.li`
  position: relative;
  list-style-type: none;
  display: inline-block;
  margin-right: 20px;
  cursor: pointer;

  .filter-blur {
    -webkit-filter: blur(5px); /* Safari 6.0 - 9.0 */
    filter: blur(5px);
  }

  .play_icon {
    position: absolute;
    top: 50%;
    right: 0px;
    left: 0px;
    margin: 0px auto;
    font-size: 42px;
    transform: translateY(-50%);
  }

  .imageOther-img,
  .imageOther-video {
    width: 120px;
    height: 120px;
    cursor: pointer;
  }

  .imageOther-container,
  .videoErrorURL-container {
    width: 90%;
    padding-bottom: 10px;
  }

  .imageOther-item,
  .videoErrorURL-item {
    position: relative;
  }

  .videoErrorURL-img,
  .videoErrorURL-video {
    width: 120px;
    height: 120px;
    cursor: pointer;
  }

  .imageOther-btn {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 15px;
    height: 15px;
    background: red;
    border-radius: 50%;
    /* padding: 15px */
  }
`;
