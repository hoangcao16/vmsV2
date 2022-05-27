import request from '@/utils/request';
const CAMERA_LIVE_ENDPOINT = '/cctv-controller-svc/api/v1/live_camera';
const camLiveApi = {
  getAll(queryParams) {
    return request.request({
      method: 'GET',
      url: CAMERA_LIVE_ENDPOINT,
      params: queryParams,
    });
  },
  update(cam, uuid) {
    return request.request({
      method: 'PUT',
      url: `${CAMERA_LIVE_ENDPOINT}/${uuid}`,
      data: cam,
    });
  },
  createNew(cam) {
    return request.request({
      method: 'POST',
      url: CAMERA_LIVE_ENDPOINT,
      data: cam,
    });
  },
  delete(uuid) {
    return request.request({
      method: 'DELETE',
      url: `${CAMERA_LIVE_ENDPOINT}/${uuid}`,
    });
  },
};

export default camLiveApi;
