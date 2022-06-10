import request from '@/utils/request';

const EventAiAPI = {
  getAllEvents: (params) => {
    return request.get(`/vms-ai/api/v1/integration-ai-events`, { params: params });
  },

  getAiEventType: (params) => {
    return request.get(`/cctv-controller-svc/api/v1/events-ai`, { params: params });
  },

  getTracingEvents: (uuid, params) => {
    let url = `/vms-ai/api/v1/ai-events/${uuid}`;
    if (REACT_APP_AI_SOURCE === 'philong') {
      url = `/vms-ai/api/v1/integration-ai-events/tracing-event/${uuid}`;
    }

    return request.get(url, { params: params });
  },

  getEventsByTrackingId: (trackingId) => {
    return request.get(`/vms-ai/api/v1/ai-events/by-tracking/${trackingId}`);
  },

  // getEventsByTrackingId: (uuid) => {
  //   return request.get(`/vms-ai/api/v1/ai-events/${uuid}`);
  // },

  editInfoOfEvent: (uuid, params) => {
    let url = `/vms-ai/api/v1/ai-events/${uuid}`;
    if (REACT_APP_AI_SOURCE === 'philong') {
      url = `/vms-ai/api/v1/integration-ai-events/${uuid}`;
    }

    return request.put(url, params);
  },

  sendTicket: (params) => {
    return request.post(`/vms-ai/api/v1/send-ticket`, params);
  },

  delete: (uuid) => {
    let url = `/vms-ai/api/v1/ai-events/${uuid}`;
    if (REACT_APP_AI_SOURCE === 'philong') {
      url = `/vms-ai/api/v1/integration-ai-events/${uuid}`;
    }
    return request.delete(url);
  },
};

export default EventAiAPI;
