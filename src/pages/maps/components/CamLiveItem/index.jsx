/* eslint-disable react-hooks/exhaustive-deps */
import CircleIcon from '@/assets/img/iconCircle';
import { notify } from '@/components/Notify';
import CameraApi from '@/services/camera/CameraApi';
import camProxyService from '@/services/camProxy';
import { CloseOutlined, ExpandOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import { connect } from 'dva';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'umi';
import { Container, StyledLoading } from './style';
const CamLiveItem = ({ dispatch, cameraIndex, listStreaming }) => {
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const pcRef = useRef(null);
  const intl = useIntl();
  const cameraStreaming = listStreaming[cameraIndex];
  const [dchanel, setDchanel] = useState(null);

  const closeRTCPeerConnection = (slotIdx) => {
    // CLOSE STREAM
    let pcLstTmp = pcRef.current;
    if (pcLstTmp?.pc) {
      pcLstTmp?.pc?.close();
    }
  };
  const reconnectCamera = (camUuid, mode) => {
    setTimeout(() => {
      dchanel?.close();
      pcRef.current?.pc?.close();
      startCamera(camUuid, mode);
    }, 10000);
  };
  const maxMinCamera = () => {
    dispatch({
      type: 'liveFullScreen/saveSelectedCamera',
      payload: cameraStreaming,
    });
  };
  useEffect(() => {
    if (cameraStreaming) {
      startCamera(cameraStreaming?.uuid, 'webrtc');
    } else {
      stopCamera();
    }
    return () => {
      closeRTCPeerConnection();
    };
  }, [cameraStreaming]);
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
      const newCameraStreaming = { ...cameraStreaming, pc: pc };
      pcRef.current = newCameraStreaming;
      let peerCode = (Math.random() + 1).toString(36).substring(10);

      pc.setConfiguration(restartConfig);
      pc.addTransceiver('video');

      pc.ontrack = (event) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
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
            console.log('>>>>> connection state: disconnected, data: ', token);
            reconnectCamera(camUuid, mode);
            break;
          case 'failed':
            console.log('>>>>> connection state: failed, data: ', token);
            reconnectCamera(camUuid, mode);
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
              if (res && pc) {
                if (pc.signalingState !== 'closed') {
                  pc.setRemoteDescription(res.payload);
                }
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
      setDchanel(dc);
    }
  };
  const closeCamera = (e) => {
    e.stopPropagation();
    const cell = document.getElementById('video-slot-' + cameraIndex);

    if (cell) {
      cell.srcObject = null;
    }
    if (cameraStreaming?.hls) {
      cameraStreaming?.hls?.destroy();
    }
    closeRTCPeerConnection(cameraIndex);
    const newLiveCameraList = [...listStreaming];
    newLiveCameraList.splice(cameraIndex, 1);
    dispatch({
      type: 'viewLiveCameras/saveListStreaming',
      payload: newLiveCameraList,
    });
  };
  const stopCamera = () => {
    videoRef.current.srcObject = null;
  };
  return (
    <Container className="map__live-card" id={cameraIndex}>
      {loading && (
        <StyledLoading>
          <Spin indicator={<LoadingOutlined size={48} />} />
        </StyledLoading>
      )}
      {cameraStreaming && cameraStreaming?.isPlay && (
        <>
          <Button className="close-btn" icon={<CloseOutlined />} onClick={closeCamera} />
          <Button className="fullsize-btn" icon={<ExpandOutlined />} onClick={maxMinCamera} />
        </>
      )}

      <video
        ref={videoRef}
        className="video-stream"
        id={'video-slot-' + cameraIndex}
        preload="auto"
        width="100%"
        height="100%"
        autoPlay
        muted="muted"
        onPlay={() => setLoading(false)}
      />
      {cameraStreaming && (
        <div className={`map__live-slot-cam-name`}>
          <span>
            <CircleIcon />
            {cameraStreaming?.name}
          </span>
        </div>
      )}
    </Container>
  );
};

function mapStateToProps(state) {
  const { liveCameraList, listStreaming } = state.viewLiveCameras;
  return { liveCameraList, listStreaming };
}
export default connect(mapStateToProps)(CamLiveItem);
