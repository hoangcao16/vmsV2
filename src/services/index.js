import request from 'utils/request';

const MyService = {
  async getRequest(url, params) {
    return request.get(url, {
      params,
    });
  },

  async postRequest(url, params) {
    return request.post(url, params);
  },
};

export default MyService;
