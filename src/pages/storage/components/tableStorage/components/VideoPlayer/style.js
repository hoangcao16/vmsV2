import styled from 'styled-components';

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

export const HeaderPanelStyled = styled.div`
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
`;

export const ContainerCapture = styled.div`
  border-top: 1px solid #e8e8e8;
  padding-top: 24px;
`;

export const ContainerEventsAI = styled.div`
  border-top: 1px solid #e8e8e8;
  padding-top: 24px;
`;
