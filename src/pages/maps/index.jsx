/* eslint-disable react-hooks/exhaustive-deps */
import CameraIcon from '@/assets/img/cameraIcon';
import LiveFullScreen from '@/components/LiveFullScreen';
import { notify } from '@/components/Notify';
import {
  LAT_LNG,
  MAP_STYLES,
  NAVIGATION_CONTROL,
  STYLE_MODE,
  TYPE_FORM_ACTION_ON_MAP,
} from '@/constants/map';
import EditCamera from '@/pages/category/camera/components/EditCamera';
import CameraApi from '@/services/camera/CameraApi';
import camProxyService from '@/services/camProxy';
import ExportEventFileApi from '@/services/exportEventFile';
import { captureVideoFrame } from '@/utils/captureVideoFrame';
import getBase64 from '@/utils/getBase64';
import { UnorderedListOutlined } from '@ant-design/icons';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { Button } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import { CircleMode, DirectMode, DragCircleMode, SimpleSelectMode } from 'mapbox-gl-draw-circle';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useIntl } from 'umi';
import { v4 as uuidV4 } from 'uuid';
import mapboxgl from 'vietmaps-gl';
import CameraListDrawer from './components/CameraListDrawer';
import CamInfoPopup from './components/CamInfoPopup';
import ViewLiveCameras from './components/ViewLiveCameras';
import { MapContainer, MapHeader } from './style';
const Maps = ({ dispatch, metadata, list, closeDrawerState, type, isOpenCameraListDrawer }) => {
  const intl = useIntl();
  const mapboxRef = useRef(null);
  const mapBoxDrawRef = useRef(null);
  const mapCamMarkersRef = useRef([]);
  const popupAttachMarkerRef = useRef(null);
  const mapMarkersRef = useRef([]);
  const markerTargetRef = useRef(null);
  const [currentLan, setCurrentLan] = useState(null);
  const [isEditDrawer, setIsEditDrawer] = useState(false);
  const [cameraOnMap, setCameraOnMap] = useState([]);
  const streamingPopupRef = useRef(null);
  const zoom = 13;
  const closeRTCPeerConnection = (slotIdx) => {
    // CLOSE STREAM
    let pcLstTmp = streamingPopupRef.current;
    if (pcLstTmp?.pc) {
      pcLstTmp?.pc?.close();
    }
  };
  const startCamera = async (camera, mode) => {
    const data = await CameraApi.checkPermissionForViewOnline({
      cameraUuid: camera?.uuid,
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
      const newCameraStreaming = { ...camera, pc: pc };
      streamingPopupRef.current = newCameraStreaming;
      let peerCode = (Math.random() + 1).toString(36).substring(10);

      pc.setConfiguration(restartConfig);
      pc.addTransceiver('video');

      pc.ontrack = (event) => {
        const cell = document.getElementById('video-slot-' + camera?.uuid);
        if (cell) {
          cell.srcObject = event.streams[0];
          cell.style = 'display:block;';
          cell.play();
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
              camUuid: camera?.uuid,
              offer: offer,
              viewType: 'live',
            })
            .then((res) => {
              if (res && pc) {
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
  const closeCamera = (cameraUuid) => {
    const cell = document.getElementById('video-slot-' + cameraUuid);

    if (cell) {
      cell.srcObject = null;
    }
    if (streamingPopupRef?.current?.hls) {
      streamingPopupRef?.current?.hls?.destroy();
    }
    closeRTCPeerConnection(cameraUuid);
  };
  //reset maker
  const resetMarker = (marker) => {
    marker &&
      marker.forEach((data) => {
        data.remove();
      });
  };
  useEffect(() => {
    setCameraOnMap(list);
  }, [list]);
  // Tạo maker
  useEffect(() => {
    resetMarker(mapMarkersRef.current);
    displayMarkerCamOnMap(cameraOnMap);
  }, [cameraOnMap]);
  const hanldeOpenCameraAIDrawer = () => {
    if (type !== 'cameraAI') {
      dispatch({
        type: 'maps/fetchAllCameraAI',
        payload: {
          page: 1,
          size: metadata?.size,
        },
      });
      dispatch({
        type: 'maps/saveIsOpenCameraListDrawer',
        payload: true,
      });
    } else {
      if (isOpenCameraListDrawer) {
        dispatch({
          type: 'maps/saveIsOpenCameraListDrawer',
          payload: false,
        });
      } else {
        dispatch({
          type: 'maps/saveIsOpenCameraListDrawer',
          payload: true,
        });
      }
    }
  };
  const hanldeOpenAdminisUnitDrawer = () => {
    if (type !== 'adminisUnit') {
      dispatch({
        type: 'maps/fetchAllAdDivisions',
        payload: {
          page: 1,
          size: metadata?.size,
        },
      });
      dispatch({
        type: 'maps/saveIsOpenCameraListDrawer',
        payload: true,
      });
    } else {
      if (isOpenCameraListDrawer) {
        dispatch({
          type: 'maps/saveIsOpenCameraListDrawer',
          payload: false,
        });
      } else {
        dispatch({
          type: 'maps/saveIsOpenCameraListDrawer',
          payload: true,
        });
      }
    }
  };
  const hanldeOpenCameraDrawer = () => {
    if (type !== 'camera') {
      dispatch({
        type: 'maps/fetchCameraList',
        payload: {
          page: 1,
          size: metadata?.size,
        },
      });
      dispatch({
        type: 'maps/saveIsOpenCameraListDrawer',
        payload: true,
      });
    } else {
      if (isOpenCameraListDrawer) {
        dispatch({
          type: 'maps/saveIsOpenCameraListDrawer',
          payload: false,
        });
      } else {
        dispatch({
          type: 'maps/saveIsOpenCameraListDrawer',
          payload: true,
        });
      }
    }
  };
  const renderCameraIcon = (cam) => {
    if (type === 'adminisUnit') {
      return `data:image/svg+xml;charset=utf-8;base64,` + btoa(CameraIcon('adminisUnit'));
    } else if (type === 'cameraAI') {
      return `data:image/svg+xml;charset=utf-8;base64,` + btoa(CameraIcon('cameraAI'));
    } else {
      if (cam.recordingStatus === 1) {
        return `data:image/svg+xml;charset=utf-8;base64,` + btoa(CameraIcon('cameraGreen'));
      }
      if (cam.recordingStatus === 0) {
        return `data:image/svg+xml;charset=utf-8;base64,` + btoa(CameraIcon('cameraRed'));
      }
      return `data:image/svg+xml;charset=utf-8;base64,` + btoa(CameraIcon('icon'));
    }
  };
  //Khoi tao map
  const showViewMap = () => {
    try {
      //vietmap token
      mapboxgl.accessToken = REACT_APP_VIETMAP_TOKEN;
      if (!mapboxRef.current) {
        //khởi tạo map
        mapboxRef.current = new mapboxgl.Map({
          container: 'map',
          style: MAP_STYLES[STYLE_MODE.normal],
          hash: true,
          center: currentLan ? currentLan : LAT_LNG,
          zoom: zoom,
          attributionControl: false,
          trackResize: true,
        });

        //thêm phần thanh công cụ zoom
        mapboxRef.current.addControl(
          new mapboxgl.NavigationControl({
            showCompass: false,
            showZoom: true,
          }),
          NAVIGATION_CONTROL,
        );
        mapboxRef.current.on('load', () => {
          mapboxRef.current.resize();
        });
        mapBoxDrawRef.current = new MapboxDraw({
          displayControlsDefault: false,
          userProperties: true,
          // defaultMode: "direct_select ",
          clickBuffer: 10,
          touchBuffer: 10,
          modes: {
            ...MapboxDraw.modes,
            draw_circle: CircleMode,
            simple_select: SimpleSelectMode,
            direct_select: DirectMode,
            drag_circle: DragCircleMode,
          },
        });

        // Add this draw object to the map when map loads
        // thêm phần control cho map: kéo, xoay map
        mapboxRef.current.addControl(mapBoxDrawRef.current);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const calRatioZoom = (marker, currentZoom) => {
    const scalePercent = 1 + (currentZoom - 8) * 0.4;
    const svgElement = marker?.getElement()?.children[0];
    svgElement.style.transform = `scale(${scalePercent})`;
    svgElement.style.transformOrigin = 'bottom';
  };
  const handleControlZoomMarker = () => {
    const currentZoom = mapboxRef.current.getZoom();
    mapCamMarkersRef.current &&
      mapCamMarkersRef.current?.forEach((marker) => {
        calRatioZoom(marker, currentZoom);
      });
  };
  // Snapshot Camera
  const setFileName = (type) => {
    if (type === 0) {
      return 'Cut.' + moment().format('DDMMYYYY.hhmmss') + '.mp4';
    }
    return 'Cap.' + moment().format('DDMMYYYY.hhmmss') + '.jpg';
  };
  const handleEditCam = (camInfo) => {
    setIsEditDrawer(true);
    dispatch({
      type: 'camera/selectUuidEdit',
      payload: camInfo?.uuid,
    });
  };
  const startSnapshotCamera = (type, camera) => {
    const cell = document.getElementById('video-slot-' + camera.uuid);
    const { blob, tBlob } = captureVideoFrame(cell, null, 'jpeg');
    if (blob) {
      const fileName = setFileName(1);
      const uuid = uuidV4();
      const createdDate = new Date();
      const createdTime = createdDate.getTime();
      const violationTime = Math.floor(createdDate.setMilliseconds(0) / 1000);
      let eventFile = {
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
      ExportEventFileApi.uploadFile(eventFile.uuid + '.jpeg', eventFile.blob).then(
        async (result) => {
          if (result && result.payload && result.payload.fileUploadInfoList.length > 0) {
            let path = result.payload.fileUploadInfoList[0].path;
            let { blob, tBlob, ...requestObject } = eventFile;
            getBase64(eventFile.tBlob, async (thumbnailData) => {
              requestObject = Object.assign({
                ...requestObject,
                pathFile: path,
                thumbnailData: [thumbnailData.replace('data:image/jpeg;base64,', '')],
              });
              const response = await ExportEventFileApi.createNewEventFile(requestObject);
              if (response) {
                notify('success', 'Playback', 'noti.successfully_take_photo_and_save');
              }
            });
          } else {
            notify('warning', 'Playback', 'noti.error_save_file');
          }
        },
      );
    }
  };
  const handleClosePopup = (type, cameraUuid) => {
    type === TYPE_FORM_ACTION_ON_MAP.cam && closeCamera(cameraUuid);
    popupAttachMarkerRef.current && popupAttachMarkerRef.current.remove();
  };

  const hanldeExposePopup = (el, popup, data = null) => {
    popup.on('open', (e) => {
      popupAttachMarkerRef.current = e.target;
      data && startCamera(data, 'webrtc');
    });
    el.addEventListener('click', (e) => {
      if (markerTargetRef.current && markerTargetRef.current != e.target) {
        handleClosePopup();
      }
      markerTargetRef.current = e.target;
    });
  };
  const createMarkerCam = (listCam, markerRef) => {
    if (listCam.length > 0) {
      listCam.forEach((camera, index) => {
        if (_.inRange(camera.lat_, -90, 90)) {
          const el = document.createElement('div');
          el.className = 'map-camera-marker-node';
          const img = document.createElement('img');
          img.setAttribute('data-imgCamId', camera.id);
          img.src = renderCameraIcon(camera);
          el.appendChild(img);
          const mapCardNode = document.createElement('div');
          mapCardNode.className = 'map-popup-node  map-camera-popup-node';
          ReactDOM.render(
            <CamInfoPopup
              trans={intl}
              type={
                type === 'adminisUnit'
                  ? TYPE_FORM_ACTION_ON_MAP.ad_unit
                  : TYPE_FORM_ACTION_ON_MAP.cam
              }
              // editMode={editMode}
              dataDetailInfo={camera}
              onClosePopup={handleClosePopup}
              handleEditInfo={handleEditCam}
              startSnapshotCamera={startSnapshotCamera}
            />,
            mapCardNode,
          );
          const popup = new mapboxgl.Popup({
            offset: 15,
            closeOnClick: false,
            className: 'mapboxql-control-popup',
          }).setDOMContent(mapCardNode);
          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([camera.long_, camera.lat_])
            .setPopup(popup)
            .addTo(mapboxRef.current);

          mapCamMarkersRef.current && mapCamMarkersRef.current.push(marker);
          markerRef.current && markerRef.current.push(marker);
          hanldeExposePopup(el, popup, camera);
        }
      });
    }
  };
  const displayMarkerCamOnMap = (listCam) => {
    createMarkerCam(listCam, mapMarkersRef);
  };
  // Tạo map
  useEffect(() => {
    dispatch({
      type: 'maps/fetchCameraList',
      payload: {
        page: metadata?.page,
        size: metadata?.size,
      },
    });
    showViewMap();
    mapboxRef.current &&
      mapboxRef.current.on('zoom', function () {
        handleControlZoomMarker();
      });
  }, []);
  useEffect(() => {
    setIsEditDrawer(false);
  }, [closeDrawerState]);
  const onRowClick = (record) => {
    setCurrentLan([record?.long_, record?.lat_]);
  };
  useEffect(() => {
    mapboxRef.current &&
      mapboxRef.current.flyTo({
        center: currentLan,
      });
  }, [currentLan]);
  return (
    <>
      <MapHeader>
        <div className="map-header-left">{intl.formatMessage({ id: 'menu.map' })}</div>
        <div className="map-header-right">
          <Button onClick={hanldeOpenCameraAIDrawer}>
            <UnorderedListOutlined />
            {intl.formatMessage(
              { id: 'view.user.detail_list.group_user_list' },
              {
                g: intl.formatMessage({ id: 'camera' }),
                u: 'AI',
              },
            )}
          </Button>
          <Button className="middle-button" onClick={hanldeOpenAdminisUnitDrawer}>
            <UnorderedListOutlined />
            {intl.formatMessage(
              { id: 'view.map.camera_list' },
              { cam: intl.formatMessage({ id: 'view.category.administrative_unit' }) },
            )}
          </Button>
          <Button onClick={hanldeOpenCameraDrawer}>
            <UnorderedListOutlined />
            {intl.formatMessage(
              { id: 'view.map.camera_list' },
              { cam: intl.formatMessage({ id: 'camera' }) },
            )}
          </Button>
        </div>
      </MapHeader>
      <MapContainer>
        <div key="map" id="map" />
        <CameraListDrawer onRowClick={onRowClick} />
        <ViewLiveCameras />
      </MapContainer>
      <EditCamera isEditDrawer={isEditDrawer} setIsEditDrawer={setIsEditDrawer} />
      <LiveFullScreen />
    </>
  );
};
const mapStateToProps = (state) => {
  const { metadata, list, cameraAIList, AdminisUnitList, type, isOpenCameraListDrawer } =
    state.maps;
  const { closeDrawerState } = state.camera;
  return {
    metadata,
    list,
    cameraAIList,
    AdminisUnitList,
    closeDrawerState,
    type,
    isOpenCameraListDrawer,
  };
};
export default connect(mapStateToProps)(Maps);
