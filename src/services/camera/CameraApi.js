import request from '@/utils/request';

const CHECK_PERMISSION_VIEW_ONLINE_ENDPOINT = '/panda/api/v1/view-online';

const CameraApi = {
  getReportCamera() {
    return request.request({
      method: 'GET',
      url: `/owl/api/v1/get-report-camera`,
    });
  },

  async checkPermissionForViewOnline(queryParams) {
    try {
      const { payload } = await request.post(CHECK_PERMISSION_VIEW_ONLINE_ENDPOINT, queryParams);
      return payload || null;
    } catch (e) {
      return null;
    }
  },
};

export default CameraApi;
