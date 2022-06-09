import request from '@/utils/request';

const DailyArchiveApi = {
  getAllDailyArchive: (params) => {
    return request.get(`/cctv-controller-svc/api/v1/files`, { params: params });
  },

  getAllGroupCamera: (params) => {
    return request.get(`/cctv-controller-svc/api/v1/camera_groups`, { params: params });
  },

  getEventFileList: (params) => {
    return request.get(`/cctv-controller-svc/api/v1/event-files`, { params: params });
  },

  checkPermissionForViewOnline: (queryParams) => {
    return request.post(`/lion/v1/playback/acceptRequest`, queryParams);
  },

  playSingleFile: (baseUrl, jsonBody) => {
    return request.post(
      'http://10.0.0.63:18602/playback1' + `/v1/playback/playSingleFile`,
      jsonBody,
    );
    // return request.post(baseUrl + `/v1/playback/playSingleFile`, jsonBody);
  },
};

export default DailyArchiveApi;
