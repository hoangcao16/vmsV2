import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useDispatch } from 'dva';
import moment from 'moment';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import styled from 'styled-components';
import { connect } from 'umi';

const BAR_WIDTH = 8;
const BAR_MINUTES = 6;
const MARK_BAR_WIDTH = 4;
const MINUTES_PER_PIXEL_RATIO = BAR_WIDTH / BAR_MINUTES;

const SeekControl = forwardRef(({ onChange, isPlay, seekDateTime }, refSeek) => {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const nextRef = useRef(null);
  const prevRef = useRef(null);
  const timerRef = useRef(null);
  const [listMarkers, setListMarkers] = useState([]);
  const [currentSeekTime, setCurrentSeekTime] = useState(moment());
  const dragState = useRef({
    isDragging: false,
    translateX: 0,
    x: 0,
  });
  useEffect(() => {
    if (seekDateTime) {
      setCurrentSeekTime(seekDateTime);
    }
  }, [seekDateTime]);
  useImperativeHandle(refSeek, () => ({
    handleSeek: handleSeek,
  }));

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      initSeek();
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    dispatch({
      type: 'live/saveCurrentSeekTime',
      payload: currentSeekTime,
    });
    return () => containerRef.current && resizeObserver.unobserve(containerRef.current);
  }, [currentSeekTime]);

  useEffect(() => {
    clearInterval(timerRef.current);

    if (isPlay) {
      timerRef.current = setInterval(() => {
        setCurrentSeekTime(currentSeekTime.clone().add(1, 's'));
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [isPlay, currentSeekTime]);

  const initSeek = () => {
    if (containerRef.current) {
      const width = containerRef.current.clientWidth;
      const totalMarkers = Math.ceil(width / BAR_WIDTH / 1.5);
      const startTime = currentSeekTime
        .clone()
        .startOf('hours')
        .subtract(totalMarkers * BAR_MINUTES, 'minutes');
      const endTime = currentSeekTime
        .clone()
        .startOf('hours')
        .add(totalMarkers * BAR_MINUTES, 'minutes');

      const markers = [];

      const translateX =
        width / 2 +
        Math.ceil(startTime.diff(currentSeekTime, 'minutes') * MINUTES_PER_PIXEL_RATIO) -
        MARK_BAR_WIDTH;
      dragState.current.translateX = translateX;

      while (startTime.isBefore(endTime)) {
        markers.push({
          time: startTime.clone(),
          isDay: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'].includes(
            startTime.format('HH:mm'),
          ),
          isHour: startTime.format('mm') === '00',
          isHalfPast: startTime.format('mm') === '30',
        });
        startTime.add(BAR_MINUTES, 'minutes');
      }

      if (contentRef.current && !dragState.current.isDragging)
        contentRef.current.style.transform = `translateX(${translateX}px)`;

      setListMarkers(markers);
    }
  };

  const onMouseDown = (e) => {
    e.preventDefault();
    if (dragState.current.isDragging) return;
    dragState.current = { ...dragState.current, isDragging: true, x: e.clientX };
  };

  const onMouseMove = (event) => {
    event.preventDefault();
    if (dragState.current.isDragging) {
      const changeX = event.clientX - dragState.current.x;
      const changeMinutes = -changeX * MINUTES_PER_PIXEL_RATIO;
      if (isPlay) {
        dispatch({
          type: 'playMode/saveIsPlay',
          payload: false,
        });
      }
      requestAnimationFrame(() => translateElement(event.clientX, changeX, changeMinutes));
    }
  };

  const onMouseUp = (e) => {
    e.preventDefault();
    if (!dragState.current.isDragging) return;
    dragState.current = {
      ...dragState.current,
      isDragging: false,
      x: 0,
    };
  };

  const translateElement = (x, changeX, changeMinutes) => {
    dragState.current.translateX += changeX;
    dragState.current.x = x;

    const nextTime = currentSeekTime.clone().add(changeMinutes, 'minutes');
    onChange && onChange(nextTime);
    setCurrentSeekTime(nextTime);
    if (contentRef.current)
      contentRef.current.style.transform = `translateX(${dragState.current.translateX}px)`;
  };

  const handleSeek = (step) => {
    setCurrentSeekTime(currentSeekTime.clone().add(step, 'minutes'));
  };

  return (
    <StyledSeekControl>
      <StyledButton icon={<MinusOutlined />} ref={prevRef} onClick={() => handleSeek(-1)} />
      <StyledListMarkerWrapper
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        ref={containerRef}
      >
        <StyledListMarkerContent ref={contentRef} onMouseMove={onMouseMove}>
          {listMarkers.map((marker, index) => (
            <StyledMarkerItem
              key={`marker-item-${index}`}
              mark={marker.isHour ? 'max' : marker.isHalfPast ? 'middle' : ''}
            >
              {marker.isHour && (
                <StyledMarkerItemHour>{marker.time.format('HH:mm')}</StyledMarkerItemHour>
              )}
              {marker.isDay && (
                <StyledMarkerItemDate>{marker.time.format('DD/MM')}</StyledMarkerItemDate>
              )}
            </StyledMarkerItem>
          ))}
        </StyledListMarkerContent>
        <StyledMarkerTime>
          <StyledMarkerTimeItem>{currentSeekTime.format('HH:mm:ss')}</StyledMarkerTimeItem>
        </StyledMarkerTime>
      </StyledListMarkerWrapper>
      <StyledButton icon={<PlusOutlined />} ref={nextRef} onClick={() => handleSeek(1)} />
    </StyledSeekControl>
  );
});

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
  user-select: none;
`;

const StyledListMarkerContent = styled.div`
  display: flex;
  height: 100%;
  cursor: pointer;
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
    border-right: ${(prop) => (prop.mark ? 2 : 1)}px solid currentColor;
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
  font-size: 10px;
  padding: 5px;
`;
const StyledMarkerItemDate = styled.p`
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  margin: 0;
  font-size: 10px;
  padding: 5px;
`;
const mapStateToProps = (state) => {
  return {
    isPlay: state?.playMode?.isPlay,
  };
};
export default connect(mapStateToProps)(SeekControl);
