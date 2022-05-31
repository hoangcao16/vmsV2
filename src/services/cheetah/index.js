import { API_CHEETAH_URL } from '@/constants/common';
import { BaseService } from '@/utils/request';

const cheetahRequest = new BaseService(API_CHEETAH_URL).instance;

const CHEETAH_ENDPOINT = '/cheetah/v1/nvr';

const cheetahService = {
  async captureFile(data) {
    return cheetahRequest.post(CHEETAH_ENDPOINT + '/captureFile', data);
  },

  //Capture online
  async startCaptureStream(data) {
    return cheetahRequest.post(CHEETAH_ENDPOINT + '/startCaptureStream', data);
  },

  async stopCaptureStream(data) {
    return cheetahRequest.post(CHEETAH_ENDPOINT + '/stopCaptureStream', data);
  },

  //Capture from playback
  async capturePlayback(data) {
    return cheetahRequest.post(CHEETAH_ENDPOINT + '/capturePlayback', data);
  },
};

export default cheetahService;
