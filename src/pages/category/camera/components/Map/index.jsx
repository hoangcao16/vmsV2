/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/self-closing-comp */
import { useEffect, useState, useRef } from 'react';
import { MAP_STYLES, STYLE_MODE, NAVIGATION_CONTROL, LAT_LNG } from '@/constants/map';
import { CircleMode, DirectMode, DragCircleMode, SimpleSelectMode } from 'mapbox-gl-draw-circle';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import mapboxgl from 'vietmaps-gl';
import { MapContainer } from './style';
const MapAddCamera = ({ resultSearchMap, handleSelectMap, defaultLongLat, isEdit }) => {
  const mapboxRef = useRef(null);
  const mapBoxDrawRef = useRef(null);
  const [currentLan, setCurrentLan] = useState(null);
  const zoom = 13;
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
          const lng = e.lngLat.lng;
          const lat = e.lngLat.lat;
          handleSelectMap(lng, lat);
          new mapboxgl.Popup({
            closeButton: false,
          })
            .setLngLat([lng, lat])
            .setHTML('Lng:' + lng + '<br/>' + 'Lat:' + lat)
            .addTo(mapboxRef.current);
        });
      });
    return () => {
      setCurrentLan(null);
      mapboxRef.current && mapboxRef.current.remove();
    };
  }, []);
  useEffect(() => {
    if (resultSearchMap) {
      const bbox = resultSearchMap?.data?.bbox;
      if (bbox?.length > 2) {
        const currentLatLngSelector = [bbox[0], bbox[1]];
        setCurrentLan(currentLatLngSelector);
        mapboxRef.current.flyTo({
          center: currentLatLngSelector,
        });
      } else {
        setCurrentLan(LAT_LNG);
        mapboxRef.current.flyTo({
          center: LAT_LNG,
        });
      }
    }
  }, [resultSearchMap]);
  useEffect(() => {
    if ((isEdit, defaultLongLat)) {
      mapboxRef.current &&
        mapboxRef.current.flyTo({
          center: defaultLongLat,
        });
      new mapboxgl.Popup({
        closeButton: false,
        className: 'mapboxgl-popup',
      })
        .setLngLat(defaultLongLat)
        .setHTML('Lng:' + defaultLongLat[0] + '<br/>' + 'Lat:' + defaultLongLat[1])
        .addTo(mapboxRef.current);
    }
    return () => {
      if (mapboxRef.current) {
        const popups = document.getElementsByClassName('mapboxgl-popup');
        if (popups.length) {
          popups[0].remove();
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
