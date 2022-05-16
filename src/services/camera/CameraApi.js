import request from '@/utils/request';
import MyService from '../RestApiClient';

const CameraApi = {
  getReportCamera: async () => {
    let result;
    try {
      result = await MyService.getRequest('/owl/api/v1/get-report-camera');
      return result.data.payload;
    } catch (error) {
      console.log(error);
      return {};
    }
  },
  getAllCameraTypes(data) {
    return request.request({
      method: 'GET',
      url: `/cctv-controller-svc/api/v1/camera_types?name=${data?.name}${
        data?.size ? `&size=${data?.size}` : ''
      }`,
    });
  },
  getAllGroupCamera(data) {
    return request.request({
      method: 'GET',
      url: `/cctv-controller-svc/api/v1/camera_groups`,
      data,
    });
  },
};

export default CameraApi;
