import request from '@/utils/request';

const EventAiAPI = {
  getAllEvents: (params) => {
    return request.get(`/vms-ai/api/v1/integration-ai-events`, { params: params });
  },

  getAiEventType: (params) => {
    return request.get(`/cctv-controller-svc/api/v1/events-ai`, { params: params });
  },
};

export default EventAiAPI;
