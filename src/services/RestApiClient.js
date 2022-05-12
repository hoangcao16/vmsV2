import request from '@/utils/request';
import _uniqueId from 'lodash/uniqueId';

const MyService = {
  async getRequest(url, params) {
    return request.get(url, {
      params,
    });
  },

  async postRequest(url, params) {
    return request.post(url, params);
  },

  async putRequest(url, params) {
    return request.put(url, params);
  },

  async deleteRequest(url, params) {
    return request.delete(url, params);
  },
};

export default MyService;
