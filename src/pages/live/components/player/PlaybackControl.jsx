/* eslint-disable react/no-array-index-key */
import { notify } from '@/components/Notify';
import {
  BackwardOutlined,
  CaretRightOutlined,
  ForwardOutlined,
  PauseOutlined,
} from '@ant-design/icons';
import { Button, DatePicker, Select, Space, TimePicker } from 'antd';
import locale from 'antd/lib/locale/vi_VN';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { connect, FormattedMessage } from 'umi';
import SeekControl from './SeekControl';

const PlaybackControl = ({ dispatch, isPlay, selectedCamera }) => {
  const [time, setTime] = useState(Date.now());
  const [seekTime, setSeekTime] = useState(moment());
  const [seekToDate, setSeekToDate] = useState(null);
  const [seekToTime, setSeekToTime] = useState(null);
  const [seekDateTime, setSeekDateTime] = useState(null);
  const timer = useRef(null);
  const seekControlRef = useRef(null);

  const listSpeedCamera = [
    {
      label: 'X0.125',
      value: 0.125,
    },
    {
      label: 'X0.25',
      value: 0.25,
    },
    {
      label: 'X0.5',
      value: 0.5,
    },
    {
      label: 'X1',
      value: 1,
    },
    {
      label: 'X2',
      value: 2,
    },
    {
      label: 'X4',
      value: 4,
    },
    {
      label: 'X8',
      value: 8,
    },
    {
      label: 'X16',
      value: 16,
    },
  ];

  useEffect(() => {
    timer.current = setInterval(() => {
      setTime(Date.now());
    }, 1000);

    return () => clearInterval(timer.current);
  }, [time]);

  const handleSeek = (step) => {
    seekControlRef.current?.handleSeek(step);
  };
  const onDateChange = (date, dateString) => {
    let now = isEmpty(dateString) ? null : moment(dateString, 'DD/MM/YYYY');
    setSeekToDate(isEmpty(now) ? null : moment(now, 'DD/MM/YYYY'));
    setSeekToTime(null);
  };
  const onTimeChange = (time, timeString) => {
    setSeekToTime(isEmpty(timeString) ? null : moment(timeString, 'HH:mm:ss'));
    if (seekToDate) {
      const seekDateTime = moment(
        moment(seekToDate).format('YYYY-MM-DD').toString() + 'T' + timeString,
      );
      setSeekDateTime(seekDateTime);
    }
  };

  const handleChangeSpeedCamera = (value) => {
    dispatch({
      type: 'live/saveSpeedVideo',
      payload: value,
    });
  };
  const handlePlay = () => {
    if (selectedCamera?.data?.uuid && selectedCamera?.data?.uuid !== '') {
      dispatch({
        type: 'playMode/saveIsPlay',
        payload: !isPlay,
      });
    } else {
      notify('error', 'noti.ERROR', 'error.CAMERA_ID_MISSING');
    }
  };
  return (
    <StyledPlaybackControl>
      <StyledTopControl>
        <StyledSpace size={24}>
          <StyledText>
            <FormattedMessage id="view.maps.select_date" />
          </StyledText>
          <DatePicker
            onChange={onDateChange}
            value={seekToDate}
            locale={locale}
            format="DD/MM/YYYY"
          />
          <StyledText>
            <FormattedMessage id="view.maps.select_time" />
          </StyledText>
          <TimePicker onChange={onTimeChange} value={seekToTime} locale={locale} />
        </StyledSpace>
        <StyledSpace justifyContent="center" size={25}>
          <StyledControlButton
            icon={<BackwardOutlined />}
            shape="circle"
            onClick={() => handleSeek(-5)}
          />
          <StyledControlButton
            playButton
            icon={isPlay ? <PauseOutlined /> : <CaretRightOutlined />}
            shape="circle"
            onClick={() => handlePlay()}
          />
          <StyledControlButton
            icon={<ForwardOutlined />}
            shape="circle"
            onClick={() => handleSeek(5)}
          />
        </StyledSpace>
        <StyledRightControl>
          <Space size={10}>
            <StyledText>
              <FormattedMessage id="pages.live-mode.speed" />
            </StyledText>
            <StyledSelectSpeed
              defaultValue={1}
              onChange={handleChangeSpeedCamera}
              options={listSpeedCamera}
            />
          </Space>
          <StyledText>{moment().format('LTS')}</StyledText>
        </StyledRightControl>
      </StyledTopControl>
      <SeekControl
        ref={seekControlRef}
        isPlay={isPlay}
        onChange={setSeekTime}
        seekDateTime={seekDateTime}
      />
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
const StyledSelectSpeed = styled(Select)`
  width: 140px;
`;
const mapStateToProps = (state) => {
  return {
    isPlay: state?.playMode?.isPlay,
    selectedCamera: state?.playMode?.selectedCamera,
  };
};
export default connect(mapStateToProps)(PlaybackControl);
