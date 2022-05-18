import request from '@/utils/request';

const DailyArchiveApi = {
  getAllDailyArchive: (params) => {
    return request.get(`/cctv-controller-svc/api/v1/files`, { params: params });
  },

  getAllGroupCamera: (params) => {
    return request.get(`/cctv-controller-svc/api/v1/camera_groups`, { params: params });
  },

  getAllCamera: (params) => {
    return request.get(`/cctv-controller-svc/api/v1/cameras`, { params: params });
  },
};

export default DailyArchiveApi;
