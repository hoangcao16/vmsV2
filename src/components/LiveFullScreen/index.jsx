/* eslint-disable react-hooks/exhaustive-deps */
import { notify } from '@/components/Notify';
import CameraApi from '@/services/camera/CameraApi';
import camProxyService from '@/services/camProxy';
import exportEventFileApi from '@/services/exportEventFile';
import { ArrowLeftOutlined, LoadingOutlined } from '@ant-design/icons';
import { Select, Spin } from 'antd';
import { connect } from 'dva';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'umi';
import { Header, StyledDrawer, StyledCountdown } from './style';
import CameraSlotControl from './components/CameraSlotControl';
import { captureVideoFrame } from '@/utils/captureVideoFrame';
import { v4 as uuidv4 } from 'uuid';
import cheetahService from '@/services/cheetah';
import moment from 'moment';
import getBase64 from '@/utils/getBase64';
import SettingPresetDrawer from '@/pages/live/components/SettingPresetDrawer';
const LiveFullScreen = ({
  dispatch,
  isOpenDrawer,
  selectedCamera,
  cameraList,
  showPresetSetting,
}) => {
  const intl = useIntl();
  const pcRef = useRef(null);
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [selected, setSelected] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef(null);
  const requestId = useRef(uuidv4());
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
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setCountdown(countdown + 1);
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [isRecording, countdown]);
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
          console.log(offer);
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
  const getFileName = (type) => {
    if (type === 0) {
      return 'Cut.' + moment().format('DDMMYYYY.hhmmss') + '.mp4';
    }
    return 'Cap.' + moment().format('DDMMYYYY.hhmmss') + '.jpg';
  };
  const captureCamera = async () => {
    try {
      const { blob, tBlob } = captureVideoFrame(videoRef.current, null, 'jpeg');
      console.log(blob, tBlob);
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
          cameraUuid: selectedCamera?.uuid,
          cameraName: selectedCamera.name,
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
      const fileName = getFileName(0);

      const params = {
        cameraId: selectedCamera.id,
        cameraName: selectedCamera.name,
        startCaptureTime: Date.now(),
        fileName: fileName,
        requestId: requestId.current,
      };

      await cheetahService.startCaptureStream(params);

      notify('success', 'playback', {
        id: 'noti.start_record_for_camera',
        params: {
          name: selectedCamera.name,
        },
      });
      setIsRecording(true);
    } catch (e) {
      console.log('Error recording: ', e);
      notify('error', 'playback', {
        id: 'noti.start_record_for_camera_failed',
        params: {
          name: selectedCamera.name,
        },
      });
    }
  };

  const stopRecording = async () => {
    if (!isRecording) return;
    clearInterval(timerRef.current);
    try {
      const params = {
        cameraId: selectedCamera.id,
        cameraName: selectedCamera.name,
        stopCaptureTime: Date.now(),
        requestId: requestId.current,
      };

      await cheetahService.stopCaptureStream(params);

      notify('success', 'playback', {
        id: 'noti.stop_record_for_camera',
        params: {
          name: selectedCamera.name,
        },
      });
      setCountdown(0);
      setIsRecording(false);
    } catch (error) {
      console.log('Error recording: ', error);
      notify('error', 'playback', {
        id: 'noti.stop_record_for_camera_failed',
        params: {
          name: selectedCamera.name,
        },
      });
    }
  };
  const handleCloseDrawer = () => {
    dispatch({ type: 'live/closeDrawerSettingCamera' });
  };
  const handleShowPresetSetting = () => {
    dispatch({
      type: 'live/openDrawerSettingCamera',
      payload: { selectedCamera },
    });
  };
  return (
    <>
      <StyledDrawer
        openDrawer={isOpenDrawer}
        onClose={onClose}
        width={'100%'}
        zIndex={1000}
        placement="right"
        closable={false}
      >
        <Header>
          <div className="title">
            <ArrowLeftOutlined className="close-icon" onClick={onClose} />
            {intl.formatMessage({ id: 'view.live.view_fullscreen' })}
          </div>
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
          <CameraSlotControl
            isRecording={isRecording}
            onCapture={captureCamera}
            onRecord={recordVideo}
            showPresetSetting={handleShowPresetSetting}
          />
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
          {isRecording && (
            <StyledCountdown>
              REC {moment('00:00:00', 'HH:mm:ss').add(countdown, 'second').format('HH:mm:ss')}
            </StyledCountdown>
          )}
        </Spin>
      </StyledDrawer>
      {showPresetSetting && (
        <SettingPresetDrawer
          showPresetSetting={showPresetSetting}
          onCloseDrawer={handleCloseDrawer}
        />
      )}
    </>
  );
};
function mapStateToProps(state) {
  const { isOpenDrawer, selectedCamera, cameraList } = state.liveFullScreen;
  const { showPresetSetting } = state.live;
  return {
    isOpenDrawer,
    selectedCamera,
    cameraList,
    showPresetSetting,
  };
}
export default connect(mapStateToProps)(LiveFullScreen);
