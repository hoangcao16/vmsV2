/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/self-closing-comp */
import { useEffect, useState, useRef } from 'react';
import { MAP_STYLES, STYLE_MODE, NAVIGATION_CONTROL, LAT_LNG } from '@/constants/map';
import { CircleMode, DirectMode, DragCircleMode, SimpleSelectMode } from 'mapbox-gl-draw-circle';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import mapboxgl from 'vietmaps-gl';
import { MapContainer } from './style';
const MapAddCamera = ({ resultSearchMap, handleSelectMap }) => {
  const mapboxRef = useRef(null);
  const mapBoxDrawRef = useRef(null);
  const [currentLan, setCurrentLan] = useState(null);
  const zoom = 14;
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
  }, []);
  useEffect(() => {
    if (resultSearchMap) {
      const bbox = resultSearchMap.data.bbox;
      const currentLatLngSelector = [bbox[2], bbox[3]];
      setCurrentLan(currentLatLngSelector);
      mapboxRef.current.flyTo({
        center: currentLatLngSelector,
      });
    }
  }, [resultSearchMap]);
  return (
    <>
      <MapContainer key="map" id="map"></MapContainer>
    </>
  );
};
export default MapAddCamera;