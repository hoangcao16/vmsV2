import { notify } from '@/components/Notify';
import CameraApi from '@/services/camera/CameraApi';
import camProxyService from '@/services/camProxy';
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'umi';

const CameraSlot = ({ cameraUuid, type, children }) => {
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (cameraUuid) {
      startCamera(cameraUuid, type, 'webrtc');
    } else {
      stopCamera();
    }
  }, [cameraUuid]);

  const startCamera = async (camUuid, type, mode) => {
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
              viewType: type,
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
    } else {
      const API = data.camproxyApi;
      const { token } = data;

      camProxyService
        .playCameraHls(API, {
          token: token,
          cameraUuid: camUuid,
          viewType: type,
        })
        .then(async (res) => {
          if (res) {
            if (videoRef.current) {
              videoRef.current.type = 'application/x-mpegURL';
              videoRef.current.innerHTML = `<source src='${API}/camproxy/v1/play/hls/${camUuid}/index.m3u8' type='application/x-mpegURL'>`;
              videoRef.current.style = 'display:block;';
              videoRef.current.play();
            }
          }
        });
    }
  };

  const stopCamera = () => {
    videoRef.current.srcObject = null;
    videoRef.current.innerHTML = null;
    videoRef.current.style = 'display:none;';
  };

  const Type = ({ type }) => {
    switch (type) {
      case 'live':
        return 'Live';
      default:
        return '';
    }
  };

  return (
    <>
      {loading && (
        <StyledLoading>
          <Spin indicator={<LoadingOutlined size={48} />} />
        </StyledLoading>
      )}
      {cameraUuid && (
        <StyledMode type="primary" size="small">
          <Type type={type} />
        </StyledMode>
      )}
      <StyledVideo
        ref={videoRef}
        width="100%"
        autoPlay
        controls={false}
        preload="none"
        crossOrigin="anonymous"
        muted="muted"
        style={{ display: 'none' }}
        onPlay={() => setLoading(false)}
      >
        <FormattedMessage id="noti.browser_not_support_video" />
      </StyledVideo>
      {children}
    </>
  );
};

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: fill;
`;

const StyledLoading = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const StyledMode = styled(Button)`
  position: absolute !important;
  top: 15px;
  right: 15px;
`;

export default React.memo(CameraSlot);
