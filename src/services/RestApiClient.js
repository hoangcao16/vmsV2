import request from '@/utils/request';
import _uniqueId from 'lodash/uniqueId';

const MyService = {
  async getRequest(url, params) {
    if (params?.report == 'report') {
      return request.get(url, {
        headers: {
          requestId: _uniqueId('cctv'),
        },
      });
    }
    return request.get(url, {
      params,
    });
  },

  async postRequest(url, params) {
    return request.post(url, params);
  },
};

export default MyService;
