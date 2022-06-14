import request from '@/utils/request';
const CHEETAH_ENDPOINT = '/cheetah/v1/nvr';

const CheetahSvcApi = {
  captureFile: (jsonBody) => {
    const baseURL = REACT_APP_CHEETAH_URL || 'http://10.0.0.62:10001';
    return request.post(baseURL + CHEETAH_ENDPOINT + '/captureFile', jsonBody);
  },
};

export default CheetahSvcApi;
