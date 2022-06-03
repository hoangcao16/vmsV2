/* eslint-disable react-hooks/exhaustive-deps */
import { connect } from 'dva';
import { StyledDrawer, Header } from './style';
import { Space, Button, Spin, Select } from 'antd';
import { useIntl } from 'umi';
import { useState, useRef, useEffect } from 'react';
import { SaveOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import CameraApi from '@/services/camera/CameraApi';
import camProxyService from '@/services/camProxy';
import { notify } from '@/components/Notify';
const LiveFullScreen = ({ dispatch, isOpenDrawer, selectedCamera, cameraList }) => {
  const intl = useIntl();
  const pcRef = useRef(null);
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const onClose = () => {
    closeRTCPeerConnection();

    if (selected?.hls) {
      selected?.hls?.destroy();
    }
    dispatch({
      type: 'liveFullScreen/closeDrawer',
    });
  };
  const closeRTCPeerConnection = (slotIdx) => {
    // CLOSE STREAM
    let pcLstTmp = pcRef.current;
    if (pcLstTmp?.pc) {
      pcLstTmp?.pc?.close();
    }
  };
  useEffect(() => {
    if (selectedCamera?.uuid) {
      startCamera(selectedCamera?.uuid, 'webrtc');
      setSelected(formatOptions(cameraList).find((item) => item.value === selectedCamera?.uuid));
    }
  }, [selectedCamera]);
  const startCamera = async (camUuid, mode) => {
    setLoading(true);
    const data = await CameraApi.checkPermissionForViewOnline({
      cameraUuid: camUuid,
      mode,
    });
    if (data == null) {
      notify('warning', 'noti.default_screen', 'noti.error_camera_address');
      return;
    }
    if (mode === 'webrtc') {
      const restartConfig = {
        iceServers: [
          {
            urls: 'stun:turn.edsolabs.com:3478',
          },
        ],
      };
      const pc = new RTCPeerConnection();
      const newCameraStreaming = { ...selectedCamera, pc: pc };
      pcRef.current = newCameraStreaming;
      let peerCode = (Math.random() + 1).toString(36).substring(10);

      pc.setConfiguration(restartConfig);
      pc.addTransceiver('video');

      pc.ontrack = (event) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
          videoRef.current.style = 'display:block;';
          videoRef.current.play();
        }
      };

      const thisTime = new Date().getTime();
      const token = (Math.random() + 1).toString(36).substring(10) + thisTime;
      let dc = pc.createDataChannel(token);

      pc.ondatachannel = (event) => {
        dc = event.channel;
        let dcTimeout = null;
        dc.onmessage = (evt) => {
          dcTimeout = setTimeout(function () {
            if (dc == null && dcTimeout != null) {
              dcTimeout = null;
              return;
            }
            const message = 'Ping from: ' + peerCode;
            if (dc.readyState === 'open') {
              dc.send(message);
            }
          }, 1000);
        };
        dc.onclose = () => {
          clearTimeout(dcTimeout);
          dcTimeout = null;
        };
      };

      pc.onconnectionstatechange = function (event) {
        switch (pc.connectionState) {
          case 'connected':
            break;
          case 'disconnected':
            break;
          case 'failed':
            break;
          case 'closed':
            break;
        }
      };

      const API = data.camproxyApi;
      pc.createOffer({
        iceRestart: true,
      })
        .then((offer) => {
          pc.setLocalDescription(offer);

          camProxyService
            .playCamera(API, {
              token: token,
              camUuid: camUuid,
              offer: offer,
              viewType: 'live',
            })
            .then((res) => {
              if (res) {
                pc.setRemoteDescription(res.payload);
              } else {
                console.log('Failed');
              }
            });
        })
        .catch((error) => {
          console.log('error:', error);
        })
        .catch((e) => console.log(e))
        .finally(() => {});
    }
  };
  const formatOptions = (options) => {
    return options.map((item) => {
      return {
        label: item.name,
        value: item.uuid,
      };
    });
  };
  const handleChange = (value) => {
    closeRTCPeerConnection();
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.innerHTML = null;
      videoRef.current.style = 'display:none;';
    }
    const selectedCam = cameraList.find((item) => item.uuid === value);
    if (selectedCam) {
      setSelected(selectedCam);
      dispatch({
        type: 'liveFullScreen/saveSelectedCamera',
        payload: selectedCam,
      });
    }
  };

  return (
    <StyledDrawer
      openDrawer={isOpenDrawer}
      onClose={onClose}
      width={'80%'}
      zIndex={1000}
      placement="right"
    >
      <Header>
        <div className="title">{intl.formatMessage({ id: 'view.live.view_fullscreen' })}</div>
        <div className="select">
          {intl.formatMessage({ id: 'camera' })}:{' '}
          <Select
            className="select-ant"
            onChange={handleChange}
            value={selected}
            options={formatOptions(cameraList)}
          />
        </div>
      </Header>
      <Spin indicator={<LoadingOutlined size={48} />} spinning={loading}>
        <video
          ref={videoRef}
          className="video-stream"
          id={'video-slot-' + selectedCamera?.uuid}
          preload="auto"
          width="100%"
          height="100%"
          autoPlay
          muted="muted"
          onPlay={() => setLoading(false)}
        />
      </Spin>
    </StyledDrawer>
  );
};
function mapStateToProps(state) {
  const { isOpenDrawer, selectedCamera, cameraList } = state.liveFullScreen;
  return {
    isOpenDrawer,
    selectedCamera,
    cameraList,
  };
}
export default connect(mapStateToProps)(LiveFullScreen);
