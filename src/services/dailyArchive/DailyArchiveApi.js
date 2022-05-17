import request from '@/utils/request';

const DailyArchiveApi = {
  getAllDailyArchive: (params) => {
    return request.get(`/cctv-controller-svc/api/v1/files`, { params: params });
  },
};

export default DailyArchiveApi;
