import MyService from '../RestApiClient';

const CameraApi = {
  getReportCamera: async () => {
    let result;

    try {
      result = await MyService.getRequest('/owl/api/v1/get-report-camera');
      return result.payload;
    } catch (error) {
      console.log(error);
      return {};
    }
  },
};
