import request from '@/utils/request';
import _uniqueId from 'lodash/uniqueId';
import { STORAGE } from '@/constants/common';
const CAMERA_ENDPOINT = '/cctv-controller-svc/api/v1/cameras';
const CAMERA_ENDPOINT_AI = '/cctv-controller-svc/api/v1/cameras/ai';
const CAMERA_SEARCH_ENDPOINT = '/cctv-controller-svc/api/v1/cameras/search';
const CAMERA_BY_TRACKING_POINT = '/cctv-controller-svc/api/v1/cameras/find_by_points';
const CAMERA_SCAN_ENDPOINT = '/ptz-ctrl/api/v1/scan-camera';
const CAMERA_TYPES_ENDPOINT = '/cctv-controller-svc/api/v1/camera_types';
const CAMERA_GROUP_ENDPOINT = '/cctv-controller-svc/api/v1/camera_groups';
const CAMERA_EXPORT_DATA_ENDPOINT = '/owl/api/v1/report-camera';
const exportHeader = () => {
  const token = localStorage.getItem(STORAGE.TOKEN);
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
  };
  if (token) {
    headers.Authorization = token;
  }
  return headers;
};
const cameraApi = {
  getAll(queryParams) {
    return request.request({
      method: 'GET',
      url: CAMERA_ENDPOINT,
      params: queryParams,
    });
  },
  getAllAI(queryParams) {
    return request.request({
      method: 'GET',
      url: CAMERA_ENDPOINT_AI,
      params: queryParams,
    });
  },
  searchCamerasWithUuids(bodyJson) {
    return request.request({
      method: 'POST',
      url: CAMERA_SEARCH_ENDPOINT,
      data: bodyJson,
    });
  },
  get(uuid) {
    return request.request({
      method: 'GET',
      url: `${CAMERA_ENDPOINT}/${uuid}`,
    });
  },
  update(cam, uuid) {
    return request.request({
      method: 'PUT',
      url: `${CAMERA_ENDPOINT}/${uuid}`,
      data: cam,
    });
  },
  createNew(cam) {
    return request.request({
      method: 'POST',
      url: CAMERA_ENDPOINT,
      data: cam,
    });
  },
  delete(uuid) {
    return request.request({
      method: 'DELETE',
      url: `${CAMERA_ENDPOINT}/${uuid}`,
    });
  },
  getCamsByTrackingPoint(bodyJson) {
    return request.request({
      method: 'POST',
      url: CAMERA_BY_TRACKING_POINT,
      data: bodyJson,
    });
  },
  scanCameraByIp(payload) {
    return request.request({
      method: 'GET',
      url: CAMERA_SCAN_ENDPOINT,
      params: payload,
    });
  },
  getAllCameraTypes(data) {
    return request.request({
      method: 'GET',
      url: CAMERA_TYPES_ENDPOINT,
      params: data,
    });
  },
  editCameraTypes(uuid, data) {
    return request.request({
      method: 'PUT',
      url: `${CAMERA_TYPES_ENDPOINT}/${uuid}`,
      data: data,
    });
  },
  addCameraTypes(data) {
    return request.request({
      method: 'POST',
      url: CAMERA_TYPES_ENDPOINT,
      data: data,
    });
  },
  deleteCameraTypes(uuid) {
    return request.request({
      method: 'DELETE',
      url: `${CAMERA_TYPES_ENDPOINT}/${uuid}`,
    });
  },
  getAllGroupCamera(data) {
    return request.request({
      method: 'GET',
      url: CAMERA_GROUP_ENDPOINT,
      params: data,
    });
  },
  getGroupCameraByUuid(uuid) {
    return request.request({
      method: 'GET',
      url: `${CAMERA_GROUP_ENDPOINT}/${uuid}`,
    });
  },
  createNewGroupCamera(data) {
    return request.request({
      method: 'POST',
      url: CAMERA_GROUP_ENDPOINT,
      data,
    });
  },
  updateGroupCamera(data, uuid) {
    return request.request({
      method: 'PUT',
      url: `${CAMERA_GROUP_ENDPOINT}/${uuid}`,
      data,
    });
  },
  deleteGroupCamera(uuid) {
    return request.request({
      method: 'DELETE',
      url: `${CAMERA_GROUP_ENDPOINT}/${uuid}`,
    });
  },
  exportData(data) {
    return request.request({
      method: 'POST',
      url: CAMERA_EXPORT_DATA_ENDPOINT,
      data,
      headers: {
        ...exportHeader(),
        requestId: _uniqueId('cctv'),
      },
      responseType: 'blob',
    });
  },
};

export default cameraApi;
