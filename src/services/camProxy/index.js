import request from '@/utils/request';

const CAMPROXY_ENDPOINT = '/camproxy/v1/play';
const CAMPROXY_ENDPOINT_HLS = '/camproxy/v1/play/hls';
const PLAYBACK_START_ENDPOINT = '/v1/playback/startPlayback';

const camProxyService = {
  async playCamera(baseUrl, data) {
    return request.post(`${baseUrl}${CAMPROXY_ENDPOINT}`, data);
  },
  async playCameraHls(baseUrl, data) {
    return request.post(`${baseUrl}${CAMPROXY_ENDPOINT_HLS}`, data);
  },
  async playbackCamera(baseUrl, jsonBody) {
    return request.post(`${baseUrl}${PLAYBACK_START_ENDPOINT}`, jsonBody, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
      },
    });
  },
};

export default camProxyService;
