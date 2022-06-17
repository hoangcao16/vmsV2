/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/self-closing-comp */
import CameraIcon from '@/assets/img/cameraIcon';
import { LAT_LNG, MAP_STYLES, NAVIGATION_CONTROL, STYLE_MODE } from '@/constants/map';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { isEmpty } from 'lodash';
import { CircleMode, DirectMode, DragCircleMode, SimpleSelectMode } from 'mapbox-gl-draw-circle';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'vietmaps-gl';
import { MapContainer } from './style';
const MapAddCamera = ({ resultSearchMap, handleSelectMap, defaultLongLat, isEdit }) => {
  const mapboxRef = useRef(null);
  const mapBoxDrawRef = useRef(null);
  const [currentLan, setCurrentLan] = useState(null);
  const zoom = 15;
  //Khoi tao map
  const showViewMap = () => {
    try {
      //vietmap token
      mapboxgl.accessToken = REACT_APP_VIETMAP_TOKEN;
      if (!mapboxRef.current) {
        //khởi tạo map
        mapboxRef.current = new mapboxgl.Map({
          container: 'mini-map',
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
  // Tạo map
  useEffect(() => {
    showViewMap();
    mapboxRef.current &&
      mapboxRef.current.on('zoom', function () {
        // handleControlZoomMarker();
      });
    mapboxRef.current &&
      mapboxRef.current.on('style.load', function () {
        mapboxRef.current.on('click', function (e) {
          const elem = document.querySelector('.map-camera-marker-node');
          if (elem) {
            elem.remove();
          }
          const lng = e.lngLat.lng;
          const lat = e.lngLat.lat;
          handleSelectMap(lng, lat);
          const el = document.createElement('div');
          el.className = 'map-camera-marker-node';
          const img = document.createElement('img');
          img.src = `data:image/svg+xml;charset=utf-8;base64,` + btoa(CameraIcon('icon'));
          el.appendChild(img);
          const popup = new mapboxgl.Popup({
            closeButton: false,
            offset: 20,
          }).setHTML('Lng:' + lng + '<br/>' + 'Lat:' + lat);
          const Maker = new mapboxgl.Marker({ element: el, draggable: true })
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(mapboxRef.current)
            .togglePopup();
          Maker.on('dragend', (e) => {
            const lng = e.target._lngLat.lng;
            const lat = e.target._lngLat.lat;
            popup.setHTML('Lng:' + lng + '<br/>' + 'Lat:' + lat);
            handleSelectMap(lng, lat);
          });
        });
      });
    return () => {
      setCurrentLan(null);
      mapboxRef.current && mapboxRef.current.remove();
    };
  }, []);
  useEffect(() => {
    if (!isEmpty(resultSearchMap)) {
      setCurrentLan(resultSearchMap);
      mapboxRef.current.flyTo({
        center: resultSearchMap,
      });
    } else {
      setCurrentLan(LAT_LNG);
      mapboxRef.current.flyTo({
        center: LAT_LNG,
      });
    }
  }, [resultSearchMap]);
  useEffect(() => {
    if ((isEdit, defaultLongLat)) {
      const elem = document.querySelector('.map-camera-marker-node');
      const elempopup = document.querySelector('.mapboxgl-popup');
      if (elem) {
        elem.remove();
      }
      if (elempopup) {
        elempopup.remove();
      }
      mapboxRef.current &&
        mapboxRef.current.flyTo({
          center: defaultLongLat,
        });
      const el = document.createElement('div');
      el.className = 'map-camera-marker-node';
      const img = document.createElement('img');
      img.src = `data:image/svg+xml;charset=utf-8;base64,` + btoa(CameraIcon('icon'));
      el.appendChild(img);
      const popup = new mapboxgl.Popup({
        closeButton: false,
        offset: 20,
      }).setHTML('Lng:' + defaultLongLat[0] + '<br/>' + 'Lat:' + defaultLongLat[1]);
      const Maker = new mapboxgl.Marker({ element: el, draggable: true })
        .setLngLat(defaultLongLat)
        .setPopup(popup)
        .addTo(mapboxRef.current)
        .togglePopup();
      Maker.on('dragend', (e) => {
        console.log(e);
        const lng = e.target._lngLat.lng;
        const lat = e.target._lngLat.lat;
        popup.setHTML('Lng:' + lng + '<br/>' + 'Lat:' + lat);
        handleSelectMap(lng, lat);
      });
    }
    return () => {
      if (mapboxRef.current) {
        var elem = document.querySelector('.map-camera-marker-node');
        if (elem) {
          elem.remove();
        }
      }
    };
  }, [isEdit, defaultLongLat]);
  return (
    <>
      <MapContainer key="map" id="mini-map"></MapContainer>
    </>
  );
};
export default MapAddCamera;
