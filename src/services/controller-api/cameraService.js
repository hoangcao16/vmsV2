import request from '@/utils/request';
const CAMERA_ENDPOINT = '/cctv-controller-svc/api/v1/cameras';
const CAMERA_ENDPOINT_AI = '/cctv-controller-svc/api/v1/cameras/ai';
const CAMERA_SEARCH_ENDPOINT = '/cctv-controller-svc/api/v1/cameras/search';
const CAMERA_BY_TRACKING_POINT = '/cctv-controller-svc/api/v1/cameras/find_by_points';
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
};

export default cameraApi;
