import request from '@/utils/request';

const CAMPROXY_ENDPOINT = '/camproxy/v1/play';
const CAMPROXY_ENDPOINT_HLS = '/camproxy/v1/play/hls';

const camProxyService = {
  async playCamera(baseUrl, data) {
    return request.post(`${baseUrl}${CAMPROXY_ENDPOINT}`, data);
  },
  async playCameraHls(baseUrl, data) {
    return request.post(`${baseUrl}${CAMPROXY_ENDPOINT_HLS}`, data);
  },
};

export default camProxyService;
