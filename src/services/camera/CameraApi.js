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
};

export default CameraApi;
