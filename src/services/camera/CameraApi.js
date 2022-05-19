import request from '@/utils/request';

const CameraApi = {
  // getReportCamera: async () => {
  //   let result;
  //   try {
  //     result = await MyService.getRequest('/owl/api/v1/get-report-camera');
  //     return result.data.payload;
  //   } catch (error) {
  //     console.log(error);
  //     return [];
  //   }
  // },
  getReportCamera() {
    return request.request({
      method: 'GET',
      url: `/owl/api/v1/get-report-camera`,
    });
  },
};

export default CameraApi;
