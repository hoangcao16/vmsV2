import { notify } from '@/components/Notify';
import { AI_SOURCE } from '@/constants/common';
import {
  CAPTURED_NAMESPACE,
  DAILY_ARCHIVE_NAMESPACE,
  EVENT_AI_NAMESPACE,
  EVENT_FILES_NAMESPACE,
  IMPORTANT_NAMESPACE,
} from '@/pages/storage/constants';
import ExportEventFileApi from '@/services/exportEventFile';
import CheetahSvcApi from '@/services/storage-api/cheetahSvcApi';
import DailyArchiveApi from '@/services/storage-api/dailyArchiveApi';
import eventFilesApi from '@/services/storage-api/eventFilesApi';
import { captureVideoFrame } from '@/utils/captureVideoFrame';
import getBase64 from '@/utils/getBase64';
import { Button, Col, Row, Space, Spin, Tooltip } from 'antd';
import { debounce } from 'lodash';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { FiCamera, FiFastForward, FiPause, FiPlay, FiRewind, FiScissors } from 'react-icons/fi';
import { reactLocalStorage } from 'reactjs-localstorage';
import { useIntl } from 'umi';
import { v4 as uuidV4 } from 'uuid';
import DrawerSetEventFile from './components/DrawerSetEventFile';
import { MemoizedHlsPlayer } from './components/MemoizedHlsPlayer/MemoizedHlsPlayer';
import { MemoizedTableEventFile } from './components/MemoizedTableEventFile/MemoizedTableEventFile';
import { MemoizedThumbnailVideo } from './components/MemoizedThumbnailVideo/MemoizedThumbnailVideo';
import TableDetailEventAI from './components/TableDetailEventAI';
import { ContainerCapture, ContainerEventsAI, HeaderPanelStyled, ViewFileContainer } from './style';
import imagePoster from './videoposter.png';

let defaultEventFile = {
  id: '',
  uuid: '',
  eventUuid: '',
  eventName: '',
  name: '',
  violationTime: -1,
  createdTime: -1,
  note: '',
  cameraUuid: '',
  cameraName: '',
  type: -1,
  length: 0,
  address: '',
  rootFileUuid: '',
  pathFile: '',
  isImportant: false,
  thumbnailData: [''],
  nginx_host: '',
  blob: null,
  isSaved: false,
  tBlob: null,
};
let playbackRate = 1;

function VideoPlayer({
  data,
  nameSpace,
  tracingList,
  saveUrlSnapshot,
  saveFileDownloadFileName,
  handleRefresh,
}) {
  const intl = useIntl();

  const [playerReady, setPlayerReady] = useState(false);
  const [urlSnapshot, setUrlSnapshot] = useState('');
  const playerVideo = useRef(null);
  const [playerSrc, setPlayerSrc] = useState('');
  const [duration, setDuration] = useState(0);
  const [playerReadyAIVideo, setPlayerReadyAIVideo] = useState(false);
  const [playerAIVideoUrl, setPlayerAIVideoUrl] = useState(false);

  const [fileCurrent, setFileCurrent] = useState(null);
  const [urlVideoTimeline, setUrlVideoTimeline] = useState(null);
  const refCanvas = useRef(null);
  const zoom = ((window.outerWidth - 10) / window.innerWidth) * 100;

  const [eventFileCurrent, setEventFileCurrent] = useState(defaultEventFile);

  const [loading, setLoading] = useState(false);
  const [captureMode, setCaptureMode] = useState(false);
  const [listEventFiles, setListEventFiles] = useState([]);
  const [originalFile, setOriginalFile] = useState(null);
  const [currNode, setCurrNode] = useState('');
  const [downloadFileName, setDownloadFileName] = useState('');
  const [eventList, setEventList] = useState([]);

  const [openSetEvent, setOpenSetEvent] = useState(false);
  const [fileSetEvent, setFileSetEvent] = useState(null);
  const [loadingSetEvent, setLoadingSetEvent] = useState(false);

  const handleOpenSetEvent = (record) => {
    setFileSetEvent(record);
    setOpenSetEvent(true);
  };

  const handleCloseSetEvent = () => {
    setOpenSetEvent(false);
  };

  const handleSetEventFile = (event) => {
    if (fileSetEvent === null) {
      return;
    }

    setLoadingSetEvent(true);
    const params = {
      ...fileSetEvent,
      tableName: 'event_file',
      eventUuid: event.uuid,
      eventName: event.name,
    };

    eventFilesApi
      .updateEventFile(params, params.uuid)
      .then((res) => {
        onClickTableFileHandler(data);
        handleCloseSetEvent();
        notify('success', 'noti.archived_file', 'noti.successfully_edit_file');
      })
      .catch((err) => {
        notify('error', 'noti.archived_file', 'noti.ERROR');
      })
      .finally(() => {
        setLoadingSetEvent(false);
      });
  };

  let addDataToEvent = (row, nameSpace) => {
    if (nameSpace === DAILY_ARCHIVE_NAMESPACE) {
      let value = {
        ...defaultEventFile,
        name: setFileName(0),
        violationTime: row?.createdTime,
        createdTime: new Date().getTime(),
        cameraUuid: row?.cameraUuid,
        cameraName: row?.cameraName,
        address: row?.address,
        rootFileUuid: row.uuid,
        type: 0,
      };

      if (value) setEventFileCurrent(value);
    } else {
      setEventFileCurrent({ ...row, blob: null, isSaved: false });
    }
    setCurrNode(row.note);
  };

  const playEventFile = async (row) => {
    setUrlVideoTimeline(null);
    let user = reactLocalStorage.getObject('user_permissions', null);
    if (user !== undefined && user !== null) {
      const playbackPermissionReq = {
        cameraUuid: row.cameraUuid,
        domain: row.domain,
        date: 0,
        userId: user.user_uuid,
        diskId: row.diskId,
      };

      const checkPerRes = await DailyArchiveApi.checkPermissionForViewOnline(playbackPermissionReq);

      if (checkPerRes) {
        const playReq = {
          fileAbsName: row.pathFile,
          domain: row.domain,
          userId: user.user_uuid,
          token: checkPerRes.payload.token,
        };

        DailyArchiveApi.playSingleFile(checkPerRes.payload.playbackUrl, playReq)
          .then((res) => {
            const videoSrc =
              checkPerRes.payload.playbackUrl + '/play/hls/' + res.payload.reqUuid + '/index.m3u8';

            setDownloadFileName(row.name);
            setDuration(row.length);
            setFileCurrent({ ...row, tableName: 'event_file' });
            setPlayerReady(true);
            setPlayerSrc(videoSrc);
            playHandler('default');
          })
          .catch((e) => {
            console.log(e);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  };

  const openFile = async (file) => {
    setLoading(true);
    try {
      // Get event file belong to this file
      const response = await DailyArchiveApi.getEventFileList({
        page: 1,
        size: 1000,
        rootFileUuid: file.uuid,
      });

      if (response && response.payload) {
        setListEventFiles(
          response.payload.map((ef) => {
            const { important, ...eventFile } = ef;
            return {
              ...eventFile,
              isImportant: ef.important,
              blob: null,
              isSaved: true,
            };
          }),
        );

        setOriginalFile({ ...file, tableName: 'file' });
        // Play file
        playFile(file);

        addDataToEvent(file, DAILY_ARCHIVE_NAMESPACE);
      }
    } catch (e) {
      // Notification({
      //   type: NOTYFY_TYPE.warning,
      //   title: `${t('noti.archived_file')}`,
      //   description: `${t('noti.error_get_file_check_again')}`,
      // });
    } finally {
      setLoading(false);
    }
  };

  const openEventFile = async (file) => {
    // setDownloadFileName()
    if (nameSpace === EVENT_AI_NAMESPACE) {
      if (REACT_APP_AI_SOURCE === AI_SOURCE.PHILONG) {
        setDownloadFileName('ImageViolate.jpg');
      } else {
        setDownloadFileName(file.fileName);
      }
    } else {
      setDownloadFileName(file.name);
    }

    addDataToEvent(file, CAPTURED_NAMESPACE);

    // IMAGE
    if (file.type === 1) {
      setFileCurrent({ ...file, tableName: 'event_file' });

      //setUrlSnapshot("data:image/jpeg;base64," + file.thumbnailData[0]);
      // Call Nginx to get blob data of file
      ExportEventFileApi.downloadFile(file.uuid + '.jpeg', file.type)
        .then(async (result) => {
          const blob = new Blob([result], { type: 'octet/stream' });
          getBase64(blob, async (image) => {
            setUrlSnapshot(image);
          });
        })
        .catch((err) => {
          console.log(err);
        });

      return;
    }

    // VIDEO
    //viewFileType === 4
    if (nameSpace === EVENT_AI_NAMESPACE) {
      if (REACT_APP_AI_SOURCE === AI_SOURCE.PHILONG) {
        await ExportEventFileApi.downloadAIIntegrationFile(file.uuid, 'ImageViolate.jpg').then(
          (result) => {
            const blob = new Blob([result], { type: 'octet/stream' });
            getBase64(blob, async (image) => {
              setUrlSnapshot(image);
            });
          },
        );
      } else {
        await ExportEventFileApi.downloadFileAI(
          file.cameraUuid,
          file.trackingId,
          file.uuid,
          file.fileName,
          4,
        ).then(async (result) => {
          const blob = new Blob([result.data], { type: 'octet/stream' });
          getBase64(blob, async (image) => {
            setUrlSnapshot(image);
          });
        });

        // setUrlSnapshot("data:image/jpeg;base64," + file.thumbnailData);
      }

      setFileCurrent({ ...file, fileType: '4' });
    }

    //
    if (file.tableName === 'file') {
      // Play file
      playFile(file);
    } else {
      // Play event file
      playEventFile(file);
    }

    if (nameSpace === EVENT_FILES_NAMESPACE) {
      setFileCurrent({ ...file, tableName: 'event_file' });
    }

    if (nameSpace === IMPORTANT_NAMESPACE) {
      setFileCurrent({ ...file });
    }
  };

  const onClickTableFileHandler = (row) => {
    if (row) {
      setCaptureMode(false);
      setUrlVideoTimeline(null);
      setUrlSnapshot('');
      if (nameSpace === DAILY_ARCHIVE_NAMESPACE) {
        openFile(row);
      } else {
        openEventFile(row);
      }
    }
  };

  const checkDisabled = () => {
    if (captureMode) return 'disabled';
    if (urlSnapshot) return 'disabled';
    if (!fileCurrent) return 'disabled';
    if (fileCurrent.uuid === '') return 'disabled';

    if (nameSpace === EVENT_AI_NAMESPACE) return 'disabled';
    return '';
  };

  const checkBtnEditRootFileDisabled = () => {
    // if (viewFileType === 0) return false;
    // if (viewFileType === 4) return false;
    // if (!fileCurrent) return false;
    // return !(fileCurrent.uuid === '' || fileCurrent.rootFileUuid === '');
    return false;
  };

  const checkBtnCaptureDisabled = () => {
    if (captureMode) return false;
    if (urlSnapshot) return false;
    if (!fileCurrent) return false;
    return fileCurrent.uuid !== '';
  };

  const playFile = async (file) => {
    let user = reactLocalStorage.getObject('user_permissions', null);
    if (user !== undefined && user !== null) {
      setLoading(true);
      const playbackPermissionReq = {
        cameraUuid: file.cameraUuid,
        domain: file.domain,
        date: 0,
        userId: user.user_uuid,
        diskId: file.diskId,
      };
      try {
        const res = await DailyArchiveApi.checkPermissionForViewOnline(playbackPermissionReq);
        let checkPerRes = res.payload;
        if (checkPerRes) {
          const playReq = {
            fileAbsName: file.path + '/' + file.name,
            domain: file.domain,
            userId: user.user_uuid,
            token: checkPerRes.token,
          };
          const data = await DailyArchiveApi.playSingleFile(checkPerRes.playbackUrl, playReq);
          const payload = data.payload;
          if (payload) {
            let videoSrc = checkPerRes.playbackUrl + '/play/hls/' + payload.reqUuid + '/index.m3u8';
            setDownloadFileName(file.name);
            setDuration(file.length);
            setFileCurrent({ ...file, tableName: 'file' });
            setPlayerReady(true);
            setPlayerSrc(videoSrc);
            playHandler('default');
            // Call Nginx to get blob data of file
            // await ExportEventFileApi.getFileData(file.id, file.fileType, file.nginx_host).then(async (result) => {
            //     const blob = new Blob([result.data], {type: "octet/stream"});
            //     const url = window.URL.createObjectURL(blob);
            //
            //     setUrlVideo(url);
            //     setDownloadFileName(file.name);
            //     setDuration(file.length);
            //     setUrlVideoTimeline(new File([blob], file.name));
            //
            //     setFileCurrent({...file, tableName: 'file'});
            //     setPlayerReady(true);
            //     setPlayerSrc(videoSrc);
            //     playHandler("default");
            // });
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
  };

  const playHandler = (cmd) => {
    const pauseEle = document.getElementById('video-control-pause');
    const playEle = document.getElementById('video-control-play');
    if (cmd === 'default') {
      pauseEle.style.display = 'none';
      playEle.style.display = 'block';
      playbackRate = 1;
      playerVideo.current.defaultPlaybackRate = playbackRate;
      playerVideo.current.playbackRate = playbackRate;
    } else if (cmd === 'play') {
      const cbRight = document.getElementById('cb-right');
      let eTime = cbRight.getAttribute('data-end_time');
      if (playerVideo.current.currentTime < +eTime) {
        pauseEle.style.display = 'block';
        playEle.style.display = 'none';
        playerVideo.current.play();
      }
    } else if (cmd === 'pause') {
      pauseEle.style.display = 'none';
      playEle.style.display = 'block';
      playerVideo.current.pause();
    } else if (cmd === 'decrease_rate') {
      if (playbackRate === 0.125) return;
      playbackRate = playbackRate / 2;
      playerVideo.current.defaultPlaybackRate = playbackRate;
      playerVideo.current.playbackRate = playbackRate;
    } else if (cmd === 'increase_rate') {
      if (playbackRate === 16) return;
      playbackRate = playbackRate * 2;
      playerVideo.current.defaultPlaybackRate = playbackRate;
      playerVideo.current.playbackRate = playbackRate;
    }
  };

  const clickTableEventFileHandler = async (eventFile, dataList) => {
    setCaptureMode(true);
    setFileCurrent(eventFile);

    if (eventFile.type === 0) {
      //Video type
      setUrlSnapshot('');
      setListEventFiles([...dataList]);
      // Play event file
      await playEventFile(eventFile);
    } else {
      //Image type
      if (eventFile.isSaved) {
        setUrlSnapshot('data:image/jpeg;base64,' + eventFile.thumbnailData[0]);
        setListEventFiles([...dataList]);
      } else {
        if (eventFile.blob) {
          const url = window.URL.createObjectURL(eventFile.blob);
          setUrlSnapshot(url);
          setListEventFiles([...dataList]);
        }
      }
    }
  };

  const deleteEventFileHandler = async (uuid) => {
    // const index = findIndex(listEventFiles, (item) => item.uuid === uuid);
    // if (index !== -1) {
    //   if (listEventFiles[index].isSaved) {
    //     let isSuccess = false;
    //     if (listEventFiles[index].type === 0) {
    //       // Video
    //       const deletePhysicalFileRes =
    //         await deleteExportEventFileApi.deletePhysicalFile(uuid);
    //       if (deletePhysicalFileRes && +deletePhysicalFileRes.code === 800) {
    //         isSuccess = true;
    //       }
    //     } else {
    //       // Image
    //       const deleteFileDataRes = await ExportEventFileApi.deleteFileData(
    //         listEventFiles[index].pathFile
    //       );
    //       if (deleteFileDataRes && deleteFileDataRes.code === '1600') {
    //         isSuccess = true;
    //       }
    //     }
    //     if (isSuccess) {
    //       const response = await ExportEventFileApi.deleteEventFile(uuid);
    //       if (response) {
    //         Notification({
    //           type: NOTYFY_TYPE.success,
    //           title: `${t('noti.archived_file')}`,
    //           description: `${t('noti.successfully_delete_file')}`,
    //         });
    //         const updatedListFile = listEventFiles.filter(
    //           (item) => item.uuid !== uuid
    //         );
    //         setListEventFiles([...updatedListFile]);
    //         setUrlSnapshot('');
    //         refresh();
    //       }
    //     }
    //   } else {
    //     const updatedListFile = listEventFiles.filter(
    //       (item) => item.uuid !== uuid
    //     );
    //     setListEventFiles([...updatedListFile]);
    //     setUrlSnapshot('');
    //   }
    // }
  };

  const editEventFileHandler = async (eventFile, dataList) => {
    // let { blob, tBlob, isSaved, ...requestObject } = eventFile; //Create requestObject without blob, isSaved fields
    // requestObject = Object.assign({ ...requestObject, isSaved: true });
    // const response = await ExportEventFileApi.updateEventFile(
    //   requestObject,
    //   requestObject.uuid
    // );
    // if (response) {
    //   Notification({
    //     type: NOTYFY_TYPE.success,
    //     title: `${t('noti.archived_file')}`,
    //     description: `${t('noti.successfully_edit_file')}`,
    //   });
    //   const index = findIndex(
    //     dataList,
    //     (item) => item.uuid === requestObject.uuid
    //   );
    //   dataList[index] = requestObject;
    //   setListEventFiles([...dataList]);
    // }
  };
  const saveEventFileHandler = (eventFile, dataList) => {
    // ExportEventFileApi.uploadFile(
    //   eventFile.uuid + '.jpeg',
    //   eventFile.blob
    // ).then(async (result) => {
    //   if (
    //     result.data &&
    //     result.data.payload &&
    //     result.data.payload.fileUploadInfoList.length > 0
    //   ) {
    //     let path = result.data.payload.fileUploadInfoList[0].path;
    //     let { blob, tBlob, isSaved, ...requestObject } = eventFile; //Create requestObject without blob, isSaved fields
    //     getBase64(eventFile.tBlob, async (thumbnailData) => {
    //       requestObject = Object.assign({
    //         ...requestObject,
    //         pathFile: path,
    //         isSaved: true,
    //         thumbnailData: [
    //           thumbnailData.replace('data:image/jpeg;base64,', ''),
    //         ],
    //       });
    //       const response = await ExportEventFileApi.createNewEventFile(
    //         requestObject
    //       );
    //       if (response) {
    //         Notification({
    //           type: NOTYFY_TYPE.success,
    //           title: `${t('noti.archived_file')}`,
    //           description: `${t('noti.successfully_add_file')}`,
    //         });
    //         let newDataList = [...dataList];
    //         const index = findIndex(
    //           newDataList,
    //           (item) => item.uuid === requestObject.uuid
    //         );
    //         newDataList[index] = requestObject;
    //         setListEventFiles([...newDataList]);
    //       }
    //     });
    //   } else {
    //     Notification({
    //       type: NOTYFY_TYPE.warning,
    //       title: `${t('noti.archived_file')}`,
    //       description: `${t('noti.error_save_file')}`,
    //     });
    //   }
    // });
  };

  const changeEditModeHandler = (dataList) => {
    setListEventFiles([...dataList]);
  };

  const originalHandler = async () => {
    // In case play capture file
    if (urlSnapshot === '') {
      // Play file
      await playFile(originalFile);
    }
    setCaptureMode(false);
    setUrlSnapshot('');
    setFileCurrent(originalFile);
  };

  const setFileName = (type) => {
    if (type === 0) {
      return 'Cut.' + moment().format('DDMMYYYY.hhmmss') + '.mp4';
    }
    return 'Cap.' + moment().format('DDMMYYYY.hhmmss') + '.jpg';
  };

  const captureSnapshotHandler = () => {
    const { blob, tBlob } = captureVideoFrame(playerVideo.current, refCanvas.current, 'jpeg');

    const uuid = uuidV4();
    const fileName = setFileName(1);

    const eventFile = {
      ...eventFileCurrent,
      uuid: uuid,
      type: 1,
      name: fileName,
      blob: blob,
      tBlob: tBlob,
    };

    ExportEventFileApi.uploadFile(eventFile.uuid, eventFile.blob)
      .then((result) => {
        let path = result.payload.fileUploadInfoList[0].path;
        let { blob, tBlob, isSaved, ...requestObject } = eventFile; //Create requestObject without blob, isSaved fields
        getBase64(eventFile.tBlob, async (thumbnailData) => {
          requestObject = Object.assign({
            ...requestObject,
            pathFile: path,
            isSaved: true,
            thumbnailData: [thumbnailData.replace('data:image/jpeg;base64,', '')],
          });
          ExportEventFileApi.createNewEventFile(requestObject)
            .then((res) => {
              notify('success', 'noti.archived_file', 'noti.successfully_add_file');
              onClickTableFileHandler(data);
            })
            .catch((err) => {
              notify('warning', 'noti.archived_file', 'noti.error_save_file');
            });
        });
      })
      .catch((err) => {
        notify('warning', 'noti.archived_file', 'noti.error_save_file');
      });
  };

  const captureVideoHandler = async () => {
    const cbLeft = document.getElementById('cb-left');
    const cbRight = document.getElementById('cb-right');
    const sTime = cbLeft.getAttribute('data-start_time');
    const eTime = cbRight.getAttribute('data-end_time');
    const fileName = fileCurrent.path + '/' + fileCurrent.name;
    const captureFileReq = {
      startCaptureTime: +sTime,
      stopCaptureTime: +eTime,
      fileName: setFileName(0),
      originalFileName: fileName,
    };
    CheetahSvcApi.captureFile(captureFileReq)
      .then((captureFileRes) => {
        let eventFile = {
          ...eventFileCurrent,
          uuid: uuidV4(),
          type: 0,
          name: captureFileRes.payload.fileName,
          length: captureFileRes.payload.length,
          pathFile: captureFileRes.payload.path + '/' + captureFileRes.payload.fileName,
          thumbnailData: captureFileRes.payload.thumbnailData,
          nginx_host: captureFileRes.payload.nginx_host,
          isSaved: true,
          diskId: fileCurrent.diskId,
        };
        let { blob, isSaved, ...requestObject } = eventFile;

        ExportEventFileApi.createNewEventFile(requestObject).then((res) => {
          notify('success', 'noti.archived_file', 'noti.successfully_add_file');
        });
      })
      .catch((err) => {
        notify('warning', 'noti.archived_file', 'noti.error_save_file');
      });
  };

  useEffect(() => {
    if (data) {
      onClickTableFileHandler(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // save
  useEffect(() => {
    saveUrlSnapshot(urlSnapshot);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSnapshot]);

  useEffect(() => {
    saveFileDownloadFileName(downloadFileName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadFileName]);

  return (
    <ViewFileContainer>
      <Row className="screenView">
        <Col span={24}>
          <div className="displayScreen">
            <div className={`iconPoster ${playerReady && !urlSnapshot ? '' : 'hidden'}`}>
              <MemoizedHlsPlayer
                playerReady={playerReady}
                urlSnapshot={urlSnapshot}
                playerVideo={playerVideo}
                playerSrc={playerSrc}
                duration={duration}
              />
            </div>
            <div
              style={{ width: '100%', height: '100%' }}
              className={`iconPoster ${
                !playerReady && playerReadyAIVideo && !urlSnapshot ? '' : 'hidden'
              }`}
            >
              <Space size="larger">
                <Spin
                  className="video-js"
                  size="large"
                  id={'spin-slot-10'}
                  style={{ display: 'none' }}
                />
              </Space>
              <video
                style={{ width: '100%', height: '100%' }}
                controls
                loop
                src={playerAIVideoUrl ? playerAIVideoUrl : ''}
              >
                <source src={playerAIVideoUrl ? playerAIVideoUrl : ''} type="video/mp4" />
              </video>
            </div>
            <img
              className={`iconPoster ${
                !playerReadyAIVideo && !playerReady && !urlSnapshot ? '' : 'hidden'
              }`}
              src={imagePoster}
              alt=""
            />
            <img
              className={`iconPoster ${urlSnapshot ? '' : 'hidden'}`}
              src={`${urlSnapshot ? urlSnapshot : imagePoster}`}
              alt=""
            />
          </div>
        </Col>
      </Row>

      <Row
        style={{
          margin: '25px 0px',
          display: `${checkDisabled() ? 'none' : 'inherit'}`,
        }}
      >
        <Col span={23} style={{ margin: 'auto' }}>
          {fileCurrent && (
            <MemoizedThumbnailVideo
              duration={duration}
              videoFile={urlVideoTimeline}
              playerVideo={playerVideo}
              fileCurrent={fileCurrent}
              nameSpace={nameSpace}
              zoom={zoom}
            />
          )}
        </Col>
        <canvas ref={refCanvas} className="snapshotCanvas" />
      </Row>

      {!checkDisabled() && (
        <Row className="playControl">
          <Col span={7} />
          <Col className="actionControl" span={10}>
            <div
              className={`disable-select ${
                checkDisabled() ? 'playIconContainer__disabled' : 'playIconContainer'
              }`}
            >
              <FiRewind
                className="playIcon"
                onClick={() => {
                  if (checkDisabled()) return;
                  playHandler('decrease_rate');
                }}
              />
            </div>

            <div
              className={`disable-select ${
                checkDisabled() ? 'playIcon2Container__disabled' : 'playIcon2Container'
              }`}
              onClick={() => {
                if (checkDisabled()) return;
                const playEle = document.getElementById('video-control-play');
                if (playEle.style.display === 'none') {
                  playHandler('pause');
                } else {
                  playHandler('play');
                }
              }}
            >
              <FiPause
                id="video-control-pause"
                className="playIcon2"
                style={{ display: 'none' }}
                // onClick={() => {
                //   if (checkDisabled()) return;
                //   playHandler("pause");
                // }}
              />
              <FiPlay
                id="video-control-play"
                className="playIcon2"
                // onClick={() => {
                //   if (checkDisabled()) return;
                //   playHandler("play");
                // }}
              />
            </div>

            <div
              className={`disable-select ${
                checkDisabled() ? 'playIconContainer__disabled' : 'playIconContainer'
              }`}
            >
              <FiFastForward
                className="playIcon"
                onClick={() => {
                  if (checkDisabled()) return;
                  playHandler('increase_rate');
                }}
              />
            </div>
          </Col>

          <Col span={7} className="captureContainer">
            {checkDisabled() &&
              nameSpace === DAILY_ARCHIVE_NAMESPACE &&
              eventFileCurrent.type !== -1 && (
                <Tooltip
                  placement="bottomLeft"
                  title={intl.formatMessage({
                    id: 'view.storage.org',
                  })}
                >
                  <span className="ogLabel" onClick={originalHandler}>
                    ORG
                  </span>
                </Tooltip>
              )}

            {checkBtnEditRootFileDisabled() && (
              <Tooltip
                placement="bottomLeft"
                title={intl.formatMessage({
                  id: 'view.storage.org',
                })}
              >
                <span
                  className="ogLabel"
                  // onClick={() => {
                  //   if (fileCurrent.tableName === 'file') {
                  //     editRootFileHandler(fileCurrent.uuid).then();
                  //   } else {
                  //     editRootFileHandler(fileCurrent.rootFileUuid).then();
                  //   }
                  // }}
                >
                  ORG
                </span>
              </Tooltip>
            )}

            {/* <Tooltip placement="bottomLeft" title={`t('view.storage.view_information')`}>
				<Popover
					overlayClassName={`${
						checkBtnInfoDisabled() ? 'fileInfoPopoverHidden' : 'fileInfoPopover'
					}`}
					placement="topRight"
					title=""
					content={checkBtnInfoDisabled() ? '' : `renderInfoPopoverContent`}
					trigger={`${checkBtnInfoDisabled() ? '' : 'click'}`}
				>
					<AiOutlineInfoCircle
						className={`${checkBtnInfoDisabled() ? 'action__disabled' : 'action'}`}
						onClick={(e) => {
							if (checkBtnInfoDisabled()) return;
							e.stopPropagation();
						}}
					/>
				</Popover>
			</Tooltip> */}

            {/* <Tooltip placement="bottomLeft" title={`t('view.storage.download_file')`}>
				<FiDownload
					className={`${checkBtnDownloadDisabled() ? 'action__disabled' : 'action'}`}
					// onClick={() => {
					//   if (checkBtnDownloadDisabled()) return;
					//   downloadFileHandler();
					// }}
				/>
			</Tooltip> */}

            {checkBtnCaptureDisabled() && (
              <Tooltip
                placement="bottomLeft"
                title={intl.formatMessage({
                  id: 'view.storage.cut_file',
                })}
              >
                <Button
                  className="btn-action"
                  type="link"
                  icon={<FiScissors className="action" />}
                  onClick={() => {
                    captureVideoHandler();
                  }}
                >
                  {intl.formatMessage({
                    id: 'view.storage.cut_file',
                  })}
                </Button>
              </Tooltip>
            )}

            {checkBtnCaptureDisabled() && (
              <Tooltip
                placement="bottomLeft"
                title={intl.formatMessage({
                  id: 'view.storage.capture_snapshot',
                })}
              >
                <Button
                  className="btn-action"
                  type="link"
                  icon={<FiCamera className="action" />}
                  onClick={debounce(captureSnapshotHandler, 500)}
                >
                  {intl.formatMessage({
                    id: 'view.storage.capture_snapshot',
                  })}
                </Button>
              </Tooltip>
            )}

            {/* <Tooltip placement="bottomLeft" title={`t('view.storage.delete')`}>
				<Popconfirm
					title={`t('noti.delete_file', { this: t('this') })`}
					cancelText={`t('view.user.detail_list.cancel')`}
					okText={`t('view.user.detail_list.confirm')`}
					// onConfirm={() => {
					//   if (checkBtnDeleteDisabled()) return;
					//   deleteFileHandler().then((r) => {});
					// }}
				>
					<RiDeleteBinLine
						className={`${checkBtnDeleteDisabled() ? 'action__disabled' : 'action'}`}
					/>
				</Popconfirm>
			</Tooltip> */}
          </Col>
        </Row>
      )}

      {nameSpace === DAILY_ARCHIVE_NAMESPACE && (
        <ContainerCapture>
          <HeaderPanelStyled>
            {intl.formatMessage({
              id: 'view.storage.list_capture_files',
            })}
          </HeaderPanelStyled>

          <MemoizedTableEventFile
            key="uuid"
            dataList={[...listEventFiles]}
            eventList={[...eventList]}
            onClickRow={clickTableEventFileHandler}
            onDeleteEventFile={deleteEventFileHandler}
            onEditEventFile={editEventFileHandler}
            onSaveEventFile={saveEventFileHandler}
            onChangeEditModeHandler={changeEditModeHandler}
            onSetEventFileHandler={handleOpenSetEvent}
          />
        </ContainerCapture>
      )}

      {nameSpace === EVENT_AI_NAMESPACE && (
        <ContainerEventsAI>
          <HeaderPanelStyled>
            {intl.formatMessage({
              id: 'view.storage.list_capture_files',
            })}
          </HeaderPanelStyled>
          <TableDetailEventAI tracingList={tracingList} />
        </ContainerEventsAI>
      )}

      {fileSetEvent !== null ? (
        <DrawerSetEventFile
          isOpenView={openSetEvent}
          handleCancel={handleCloseSetEvent}
          handleSetEventFile={handleSetEventFile}
          loadingSetEvent={loadingSetEvent}
          fileSetEvent={fileSetEvent}
        />
      ) : (
        <></>
      )}
    </ViewFileContainer>
  );
}

export default VideoPlayer;
