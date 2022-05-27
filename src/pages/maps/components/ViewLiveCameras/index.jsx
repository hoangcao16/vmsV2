/* eslint-disable react-hooks/exhaustive-deps */
import { LeftSider, HeaderSider } from './style';
import { useIntl } from 'umi';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import CamLiveItem from '../CamLiveItem';
const ViewLiveCameras = ({ dispatch, liveCameraList, cameraList }) => {
  const intl = useIntl();
  const [isCollapsedCameraLive, setIsCollapsedCameraForm] = useState(false);
  const toggleCollapsedCameraLive = () => {
    setIsCollapsedCameraForm(!isCollapsedCameraLive);
  };
  useEffect(() => {
    const listStreaming = liveCameraList.map((itemLive) => {
      const finded = cameraList.find((item) => item.uuid === itemLive);
      if (finded) {
        finded.isPlay = true;
        return finded;
      }
    });
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
        {liveCameraList.map((item, index) => {
          return <CamLiveItem key={item} cameraIndex={index} cameraUuid={item} />;
        })}
      </div>
    </LeftSider>
  );
};
function mapStateToProps(state) {
  const { liveCameraList } = state.viewLiveCameras;
  const { cameraList } = state.maps;
  return { liveCameraList, cameraList };
}
export default connect(mapStateToProps)(ViewLiveCameras);
