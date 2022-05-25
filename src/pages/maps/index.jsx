/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react';
import { MAP_STYLES, STYLE_MODE, NAVIGATION_CONTROL, LAT_LNG } from '@/constants/map';
import { CircleMode, DirectMode, DragCircleMode, SimpleSelectMode } from 'mapbox-gl-draw-circle';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import mapboxgl from 'vietmaps-gl';
import { MapContainer, MapHeader } from './style';
import ReactDOM from 'react-dom';
import { useIntl } from 'umi';
import { Button } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import LiveCameras from './components/LiveCameras';
import { TYPE_FORM_ACTION_ON_MAP } from '@/constants/map';
import CamInfoPopup from './components/CamInfoPopup';
import CameraIcon from '@/assets/img/cameraIcon';
const Maps = ({ dispatch, metadata, cameraList, cameraAIList, AdminisUnitList }) => {
  const intl = useIntl();
  const mapboxRef = useRef(null);
  const mapBoxDrawRef = useRef(null);
  const mapCamMarkersRef = useRef([]);
  const mapAdUnitMarkersRef = useRef([]);
  const popupAttachMarkerRef = useRef(null);
  const mapMarkersRef = useRef([]);
  const markerTargetRef = useRef(null);
  const [currentLan, setCurrentLan] = useState(null);
  const [isOpenLiveCameras, setIsOpenLiveCameras] = useState(false);
  const [cameraOnMap, setCameraOnMap] = useState([]);
  const zoom = 13;
  //reset maker
  const resetMarker = (marker) => {
    marker &&
      marker.forEach((data) => {
        data.remove();
      });
  };
  useEffect(() => {
    setCameraOnMap(cameraList);
  }, [cameraList]);
  // Tạo maker
  useEffect(() => {
    resetMarker(mapMarkersRef.current);
    displayMarkerCamOnMap(cameraOnMap);
  }, [cameraOnMap]);
  const hanldeOpenCameraAIDrawer = () => {};
  const hanldeOpenAdminisUnitDrawer = () => {};
  const hanldeOpenCameraDrawer = () => {
    setIsOpenLiveCameras(true);
  };
  const renderCameraIcon = (cam) => {
    if (cam.source === 1) {
      return `data:image/svg+xml;charset=utf-8;base64,` + btoa(CameraIcon('cameraGreen'));
    }
    if (cam.recordingStatus === 0) {
      return `data:image/svg+xml;charset=utf-8;base64,` + btoa(CameraIcon('cameraRed'));
    }
    return `data:image/svg+xml;charset=utf-8;base64,` + btoa(CameraIcon('icon'));
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
    mapAdUnitMarkersRef.current &&
      mapAdUnitMarkersRef.current?.forEach((marker) => {
        calRatioZoom(marker, currentZoom);
      });
  };
  const handleEditCam = (camInfo) => {};
  const startSnapshotCamera = (type, camera) => {};
  const handleClosePopup = (type, slotId) => {
    // type === TYPE_FORM_ACTION_ON_MAP.cam && CameraService.closeCamera(slotId);
    popupAttachMarkerRef.current && popupAttachMarkerRef.current.remove();
  };
  const hanldeExposePopup = (el, popup, data = null) => {
    popup.on('open', (e) => {
      // cameraOnMap.forEach((cam) => {
      // data && CameraService.closeCamera(cam.uuid);
      // });
      popupAttachMarkerRef.current = e.target;
      // data &&
      // CameraService.playCameraOnline(data, data.uuid).then((res) => {
      // console.log(res);
      // });
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
              type={TYPE_FORM_ACTION_ON_MAP.cam}
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
          const marker = new mapboxgl.Marker({ element: el, draggable: true })
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
        <LiveCameras
          isOpenLiveCameras={isOpenLiveCameras}
          setIsOpenLiveCameras={setIsOpenLiveCameras}
        />
      </MapContainer>
    </>
  );
};
const mapStateToProps = (state) => {
  const { metadata, cameraList, cameraAIList, AdminisUnitList } = state.maps;
  return { metadata, cameraList, cameraAIList, AdminisUnitList };
};
export default connect(mapStateToProps)(Maps);
