import request from '@/utils/request';

const FieldEventApi = {
  getAllFieldEvent() {
    return request.request({
      method: 'GET',
      url: '/cctv-controller-svc/api/v1/event_fields',
    });
  },
};

export default FieldEventApi;
