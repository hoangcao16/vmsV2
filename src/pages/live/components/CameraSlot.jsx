import { notify } from '@/components/Notify';
import { LIVE_MODE } from '@/constants/common';
import CameraApi from '@/services/camera/CameraApi';
import camProxyService from '@/services/camProxy';
import cheetahService from '@/services/cheetah';
import exportEventFileApi from '@/services/exportEventFile';
import { captureVideoFrame } from '@/utils/captureVideoFrame';
import getBase64 from '@/utils/getBase64';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { connect, FormattedMessage } from 'umi';
import { v4 as uuidv4 } from 'uuid';

import CameraSlotControl from './CameraSlotControl';

const CameraSlot = ({ screen, camera, dispatch, isDraggingOver, layoutCollapsed }) => {
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [zoomIn, setZoomIn] = useState(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(moment().subtract(1, 'h').unix());
  const videoRef = useRef(null);
  const peerRef = useRef(null);
  const timerRef = useRef(null);
  const requestId = useRef(uuidv4());

  useEffect(() => {
    if (camera.uuid) {
      startCamera(camera.uuid, camera.type, 'webrtc');
    } else {
      closeCamera();
    }
  }, [camera]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setCountdown(countdown + 1);
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [isRecording, countdown]);

  const startCamera = async (camUuid, type, mode) => {
    setLoading(true);
    const data = await CameraApi.checkPermissionForViewOnline({
      cameraUuid: camUuid,
      mode,
    });

    if (data == null) {
      notify('warning', 'noti.default_screen', 'noti.error_camera_address');
      setLoading(false);
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
      peerRef.current = new RTCPeerConnection();
      let peerCode = (Math.random() + 1).toString(36).substring(10);

      peerRef.current?.setConfiguration(restartConfig);
      peerRef.current?.addTransceiver('video');

      peerRef.current.ontrack = (event) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
          videoRef.current.style = 'display:block;';
          videoRef.current.play();
        }
      };

      const thisTime = new Date().getTime();
      const token = (Math.random() + 1).toString(36).substring(10) + thisTime;
      let dc = peerRef.current?.createDataChannel(token);

      peerRef.current.ondatachannel = (event) => {
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

      peerRef.current.onconnectionstatechange = function (event) {
        switch (peerRef.current?.connectionState) {
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
      peerRef.current
        ?.createOffer({
          iceRestart: true,
        })
        .then((offer) => {
          peerRef.current?.setLocalDescription(offer);

          camProxyService
            .playCamera(API, {
              token: token,
              camUuid: camUuid,
              offer: offer,
              viewType: type,
            })
            .then((res) => {
              if (res) {
                peerRef.current?.setRemoteDescription(res.payload);
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

  const closeCamera = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
      videoRef.current.innerHTML = null;
      videoRef.current.style = 'display:none;';
    }
    peerRef.current?.close();

    dispatch({
      type: 'live/closeCamera',
      payload: camera,
    });
  };

  const getFileName = (type) => {
    if (type === 0) {
      return 'Cut.' + moment().format('DDMMYYYY.hhmmss') + '.mp4';
    }
    return 'Cap.' + moment().format('DDMMYYYY.hhmmss') + '.jpg';
  };

  const recordVideo = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    clearInterval(timerRef.current);
    try {
      if (camera.type === LIVE_MODE.LIVE) {
        const fileName = getFileName(0);

        const params = {
          cameraId: camera.id,
          cameraName: camera.name,
          startCaptureTime: Date.now(),
          fileName: fileName,
          requestId: requestId.current,
        };

        await cheetahService.startCaptureStream(params);
      }

      notify('success', 'Playback', {
        id: 'noti.start_record_for_camera',
        params: {
          name: camera.name,
        },
      });
      setIsRecording(true);
    } catch (e) {
      console.log('Error recording: ', e);
      notify('error', 'Playback', {
        id: 'noti.start_record_for_camera_failed',
        params: {
          name: camera.name,
        },
      });
    }
  };

  const stopRecording = async () => {
    clearInterval(timerRef.current);
    try {
      if (camera.type === LIVE_MODE.LIVE) {
        const params = {
          cameraId: camera.id,
          cameraName: camera.name,
          stopCaptureTime: Date.now(),
          requestId: requestId.current,
        };

        await cheetahService.stopCaptureStream(params);
      } else if (videoRef.current) {
        const playbackTimeInSecond = Math.floor(videoRef.current.currentTime);
        const startTime = currentPlaybackTime + playbackTimeInSecond;
        const stopTime = startTime + countdown;
        const fileName = getFileName(0);

        const params = {
          cameraId: camera.id,
          cameraName: camera.name,
          startCaptureTime: +startTime,
          stopCaptureTime: +stopTime,
          fileName: fileName,
          requestId: requestId.current,
        };

        const { payload } = await cheetahService.capturePlayback(params);

        const uuid = uuidv4();

        let requestObject = {
          id: '',
          uuid: uuid,
          eventUuid: '',
          eventName: '',
          name: fileName,
          violationTime: startTime,
          createdTime: Date.now(),
          note: '',
          cameraUuid: camera.uuid,
          cameraName: camera.name,
          type: 0,
          length: payload.length,
          address: '',
          rootFileUuid: '',
          pathFile: payload.path + '/' + fileName,
          isImportant: false,
          thumbnailData: payload.thumbnailData,
          nginx_host: payload.nginx_host,
          diskId: payload.diskId,
        };

        await exportEventFileApi.createNewEventFile(requestObject);
      }

      notify('success', 'Playback', {
        id: 'noti.stop_record_for_camera',
        params: {
          name: camera.name,
        },
      });
      setCountdown(0);
      setIsRecording(false);
    } catch (error) {
      console.log('Error recording: ', error);
      notify('error', 'Playback', {
        id: 'noti.stop_record_for_camera_failed',
        params: {
          name: camera.name,
        },
      });
    }
  };

  const captureCamera = async () => {
    try {
      const { blob, tBlob } = captureVideoFrame(videoRef.current, null, 'jpeg');
      if (blob) {
        const fileName = getFileName(1);
        const uuid = uuidv4();
        const createdDate = new Date();
        const createdTime = createdDate.getTime();
        const violationTime = Math.floor(createdDate.setMilliseconds(0) / 1000);

        const eventFile = {
          id: '',
          uuid: uuid,
          eventUuid: '',
          eventName: '',
          name: fileName,
          violationTime: violationTime,
          createdTime: createdTime,
          note: '',
          cameraUuid: camera.uuid,
          cameraName: camera.name,
          type: 1,
          length: 0,
          address: '',
          rootFileUuid: '',
          pathFile: '',
          isImportant: false,
          thumbnailData: [''],
          nginx_host: '',
          blob: blob,
          tBlob: tBlob,
        };

        const { payload } = await exportEventFileApi.uploadFile(eventFile.uuid, blob);
        if (payload && payload.fileUploadInfoList.length > 0) {
          let path = payload.fileUploadInfoList[0].path;
          let { blob, tBlob, ...rest } = eventFile;

          getBase64(tBlob, async (thumbnailData) => {
            rest = {
              ...rest,
              pathFile: path,
              thumbnailData: [thumbnailData.replace('data:image/jpeg;base64,', '')],
            };

            const response = await exportEventFileApi.createNewEventFile(rest);
            if (response) {
              notify('success', 'Save file', 'noti.successfully_take_photo_and_save');
            }
          });
        } else {
          throw new Error();
        }
      }
    } catch (error) {
      console.log(error);
      notify('error', 'Save file', 'noti.error_save_file');
    }
  };

  const zoomCamera = () => {
    setZoomIn(!zoomIn);
    console.log(!camera?.id);
  };

  return (
    <StyledCameraSlot
      isDraggingOver={isDraggingOver}
      zoomIn={zoomIn}
      layoutCollapsed={layoutCollapsed}
      notFoundCamera={!camera?.id}
    >
      {loading && (
        <StyledLoading>
          <Spin indicator={<LoadingOutlined size={48} />} />
        </StyledLoading>
      )}
      {camera && (
        <>
          <StyledCameraSlotControl
            camera={camera}
            isRecording={isRecording}
            onCapture={captureCamera}
            onRecord={recordVideo}
            onClose={closeCamera}
            mode={screen.mode}
            zoomIn={zoomIn}
            onZoom={zoomCamera}
          />
          <StyledCameraBottom>
            <StyledCameraName>{camera.name}</StyledCameraName>
            {isRecording && (
              <StyledCountdown>
                {moment('00:00:00', 'HH:mm:ss').add(countdown, 'second').format('HH:mm:ss')}
              </StyledCountdown>
            )}
          </StyledCameraBottom>
        </>
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
    </StyledCameraSlot>
  );
};

const StyledCameraSlotControl = styled(CameraSlotControl)``;

const StyledCameraSlot = styled.div`
  width: 100%;
  height: 100%;
  ${(props) => props.isDraggingOver && 'display: none;'}
  ${(props) =>
    props.zoomIn &&
    `position: fixed; bottom : 0; right: 0; height: calc(100vh - 48px); width: calc(100vw - ${
      props?.layoutCollapsed ? '53px' : '215px'
    }) !important; z-index: 1000; ${props.notFoundCamera && 'background-color: #3f4141;'}`}

  &:hover {
    cursor: pointer;

    ${StyledCameraSlotControl} {
      visibility: visible;
    }
  }
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: fill;
  z-index: 10;
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
  z-index: 999;
`;

const StyledCameraBottom = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  display: flex;
`;

const StyledCameraName = styled.div`
  position: relative;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: #ccc;
  z-index: 11;
  padding: 0 15px;
  flex: 1;
  line-height: 1.6rem;

  &::after {
    position: absolute;
    top: 50%;
    left: 0;
    width: 7px;
    height: 7px;
    border: 1px solid #000;
    border-radius: 50%;
    transform: translateY(-50%);
    content: '';
  }
`;

const StyledCountdown = styled.div`
  background-color: #f00;
  padding: 2px 8px;
  border-radius: 2px;
`;

const mapStateToProps = (state) => {
  return {
    screen: state.live.screen,
    layoutCollapsed: state?.globalstore?.layoutCollapsed,
  };
};

export default connect(mapStateToProps)(React.memo(CameraSlot));
