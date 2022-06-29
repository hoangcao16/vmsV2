import request from '@/utils/request';

const FieldEventApi = {
    // getAllFieldEvent(params) {
    //     return request.request({
    //         method: 'GET',
    //         url: '/cctv-controller-svc/api/v1/event_fields',
    //     });
    // },
    getAllFieldEvent(params) {
        return request.get(`/cctv-controller-svc/api/v1/event_fields`, { params: params });
    },
    addField: async(values) => {
        return request.post('/cctv-controller-svc/api/v1/event_fields', values);
    },

    editField: async(uuid, values) => {
        return request.put(`/cctv-controller-svc/api/v1/event_fields/${uuid}`, values);
    },

    deleteField: async(uuid) => {
        return request.delete(`/cctv-controller-svc/api/v1/event_fields/${uuid}`);
    },

    getAllEventType: (params) => {
        return request.get(`/cctv-controller-svc/api/v1/events`, { params: params });
    },
    addEventType: async(values) => {
        return request.post('/cctv-controller-svc/api/v1/events', values);
    },

    editEventType: async(uuid, values) => {
        return request.put(`/cctv-controller-svc/api/v1/events/${uuid}`, values);
    },

    deleteEventType: async(uuid) => {
        return request.delete(`/cctv-controller-svc/api/v1/events/${uuid}`);
    },
};

export default FieldEventApi;