import PTZApi from '@/services/ptz/PTZApi';
import {
  CaretDownOutlined,
  CaretLeftOutlined,
  CaretRightOutlined,
  CaretUpOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { connect } from 'dva';
import { useState } from 'react';
import styled from 'styled-components';
import './control.less';

const Control = ({ dispatch, cameraSelected }) => {
  const [speed, setSpeed] = useState(1);
  const [isActionIsStart, setIsActionStart] = useState(false);

  const onPanLeftStart = async () => {
    console.log('onPanLeftStart');
    const payload = {
      cameraUuid: cameraSelected?.uuid,
      direction: 'left',
      isStop: 0,
      speed: speed,
    };
    try {
      setIsActionStart(true);
      await PTZApi.postPan(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onPanLeftEnd = async () => {
    console.log('onPanLeftEnd');
    const payload = {
      cameraUuid: cameraSelected?.uuid,
      direction: 'left',
      isStop: 1,
      speed: speed,
    };
    try {
      if (isActionIsStart) {
        await PTZApi.postPan(payload);
        setIsActionStart(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onPanRightStart = async () => {
    const payload = {
      cameraUuid: cameraSelected?.uuid,
      direction: 'right',
      isStop: 0,
      speed: speed,
    };
    try {
      setIsActionStart(true);
      await PTZApi.postPan(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onPanRightEnd = async () => {
    const payload = {
      cameraUuid: cameraSelected?.uuid,
      direction: 'right',
      isStop: 1,
      speed: speed,
    };
    try {
      if (isActionIsStart) {
        await PTZApi.postPan(payload);
        setIsActionStart(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onTiltUpStart = async () => {
    const payload = {
      cameraUuid: cameraSelected?.uuid,
      direction: 'up',
      isStop: 0,
      speed: speed,
    };
    try {
      setIsActionStart(true);
      await PTZApi.postTilt(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onTiltUpEnd = async () => {
    const payload = {
      cameraUuid: cameraSelected?.uuid,
      direction: 'up',
      isStop: 1,
      speed: speed,
    };
    try {
      if (isActionIsStart) {
        await PTZApi.postTilt(payload);
        setIsActionStart(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onTiltDownStart = async () => {
    const payload = {
      cameraUuid: cameraSelected?.uuid,
      direction: 'down',
      isStop: 0,
      speed: speed,
    };
    try {
      setIsActionStart(true);
      await PTZApi.postTilt(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onTiltDownEnd = async () => {
    const payload = {
      cameraUuid: cameraSelected?.uuid,
      direction: 'down',
      isStop: 1,
      speed: speed,
    };
    try {
      if (isActionIsStart) {
        await PTZApi.postTilt(payload);
        setIsActionStart(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onZoomInStart = async () => {
    const payload = {
      cameraUuid: cameraSelected?.uuid,
      direction: 'in',
      isStop: 0,
      speed: speed,
    };
    try {
      setIsActionStart(true);
      await PTZApi.postZoom(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onZoomInEnd = async () => {
    const payload = {
      cameraUuid: cameraSelected?.uuid,
      direction: 'in',
      isStop: 1,
      speed: speed,
    };
    try {
      if (isActionIsStart) {
        await PTZApi.postZoom(payload);
        setIsActionStart(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onZoomOutStart = async () => {
    const payload = {
      cameraUuid: cameraSelected?.uuid,
      direction: 'out',
      isStop: 0,
      speed: speed,
    };
    try {
      setIsActionStart(true);
      await PTZApi.postZoom(payload);
    } catch (error) {
      console.log(error);
    }
  };
  const onZoomOutEnd = async () => {
    const payload = {
      cameraUuid: cameraSelected?.uuid,
      direction: 'out',
      isStop: 1,
      speed: speed,
    };
    try {
      if (isActionIsStart) {
        await PTZApi.postZoom(payload);
        setIsActionStart(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setUpSpeed = () => {
    if (speed <= 5) {
      setSpeed(speed + 1);
    }
  };

  const setDownSpeed = () => {
    if (speed > 1) {
      setSpeed(speed - 1);
    }
  };

  return (
    <div className="container">
      <nav>
        <div
          className="button top"
          onMouseDown={onTiltUpStart}
          onMouseUp={onTiltUpEnd}
          onMouseLeave={onTiltUpEnd}
        >
          <i className="iIcon">
            <CaretUpOutlined />
          </i>
        </div>
        <div
          className="button right"
          onMouseDown={onPanRightStart}
          onMouseUp={onPanRightEnd}
          onMouseLeave={onPanRightEnd}
        >
          <i className="iIcon">
            <CaretRightOutlined />
          </i>
        </div>
        <div
          className="button left"
          onMouseDown={onPanLeftStart}
          onMouseUp={onPanLeftEnd}
          onMouseLeave={onPanLeftEnd}
        >
          <i className="iIcon">
            <CaretLeftOutlined />
          </i>
        </div>
        <div
          className="button bottom"
          onMouseDown={onTiltDownStart}
          onMouseUp={onTiltDownEnd}
          onMouseLeave={onTiltDownEnd}
        >
          <i className="iIcon">
            <CaretDownOutlined />
          </i>
        </div>
        <div className="center-wrapper">
          <div className="center-button">
            <div className="center-button--content">
              <UpOutlined onClick={setUpSpeed} />
              <div className="inner-circle-content--number">{speed}</div>
              <DownOutlined onClick={setDownSpeed} />
            </div>
          </div>
        </div>
      </nav>
      <div className="zoom">
        <Wrapper>
          <ZoomButton onMouseDown={onZoomInStart} onMouseUp={onZoomInEnd}>
            +
          </ZoomButton>
          Zoom
          <ZoomButton onMouseDown={onZoomOutStart} onMouseUp={onZoomOutEnd}>
            -
          </ZoomButton>
        </Wrapper>
      </div>
    </div>
  );
};

const Wrapper = styled.div`
  height: 48px;
  width: 142px;
  background-color: rgb(6, 6, 6);
  border-radius: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px;
  margin-left: 100px;
`;

const ZoomButton = styled.div`
  height: 42px;
  width: 42px;
  border-radius: 50%;
  background-color: #444;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

function mapStateToProps(state) {
  const { cameraSelected } = state.live;

  return {
    cameraSelected,
  };
}

export default connect(mapStateToProps)(Control);
