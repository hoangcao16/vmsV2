import request from '@/utils/request';

const importantFilesApi = {
  getAllFiles: (params) => {
    return request.get(`/cctv-controller-svc/api/v1/important_files`, { params: params });
  },
};

export default importantFilesApi;
