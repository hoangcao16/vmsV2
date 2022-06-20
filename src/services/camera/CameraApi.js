import request from '@/utils/request';

const CHECK_PERMISSION_VIEW_ONLINE_ENDPOINT = '/panda/api/v1/view-online';
const LION_ENDPOINT = '/lion/v1/playback/acceptRequest';

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
  async checkPermissionForViewPlayback(queryParams) {
    try {
      const { payload } = await request.post(LION_ENDPOINT, queryParams);
      return payload || null;
    } catch (e) {
      return null;
    }
  },
};

export default CameraApi;
