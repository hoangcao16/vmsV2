/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/exhaustive-deps */
import { LeftSider, HeaderSider } from './style';
import { useIntl } from 'umi';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import CamLiveItem from '../CamLiveItem';
const ViewLiveCameras = ({ dispatch, liveCameraList, cameraList, listStreaming }) => {
  const intl = useIntl();
  const [isCollapsedCameraLive, setIsCollapsedCameraForm] = useState(false);
  const [cameraSlots, setCameraSlots] = useState([
    {
      pc: null,
      slotId: 0,
      camId: '',
      isPlay: false,
      hls: null,
    },
    {
      pc: null,
      slotId: 1,
      camId: '',
      isPlay: false,
      hls: null,
    },
    {
      pc: null,
      slotId: 2,
      camId: '',
      isPlay: false,
      hls: null,
    },
    {
      pc: null,
      slotId: 3,
      camId: '',
      isPlay: false,
      hls: null,
    },
  ]);
  const toggleCollapsedCameraLive = () => {
    setIsCollapsedCameraForm(!isCollapsedCameraLive);
  };
  useEffect(() => {
    const listStreaming = liveCameraList
      .map((itemLive) => {
        const finded = cameraList.find((item) => item.uuid === itemLive);
        if (finded) {
          finded.isPlay = true;
          return finded;
        }
      })
      .filter((item) => item !== undefined);
    dispatch({
      type: 'viewLiveCameras/saveListStreaming',
      payload: listStreaming,
    });
  }, [liveCameraList, cameraList]);
  return (
    <LeftSider data-type={isCollapsedCameraLive ? 'collapsed' : ''}>
      <HeaderSider>
        <div className="title" data-type={isCollapsedCameraLive ? 'collapsed' : ''}>
          {intl.formatMessage({ id: 'view.user.detail_list.view_online' })}
        </div>
        <Button
          icon={isCollapsedCameraLive ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
          onClick={toggleCollapsedCameraLive}
        />
      </HeaderSider>
      <div className="content">
        {cameraSlots.map((item, index) => {
          return <CamLiveItem key={index} cameraIndex={index} cameraUuid={item?.uuid} />;
        })}
      </div>
    </LeftSider>
  );
};
function mapStateToProps(state) {
  const { liveCameraList, listStreaming } = state.viewLiveCameras;
  const { cameraList } = state.liveFullScreen;
  return { liveCameraList, cameraList, listStreaming };
}
export default connect(mapStateToProps)(ViewLiveCameras);
