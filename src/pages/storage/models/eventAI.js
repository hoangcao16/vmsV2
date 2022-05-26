import EventAiAPI from '@/services/storage-api/eventAI-api';
import { EVENT_AI_NAMESPACE, LIST_VIEW } from '../constants';

export const initSearchEventsAI = {
  startRecordTime: -1,
  endRecordTime: -1,
  address: '',
  provinceId: '',
  districtId: '',
  wardId: '',
  administrativeUnitUuid: '',
  fileType: 0,
  cameraGroupUuid: '',
  cameraUuid: '',
  type: -1,
  eventUuid: '',
  searchType: 'all',
  eventType: '',
  status: '',
};

export default {
  namespace: EVENT_AI_NAMESPACE,
  state: {
    list: [],
    metadata: {
      page: 1,
      size: 10,
      total: 0,
      ...initSearchEventsAI,
    },
    viewType: LIST_VIEW,
  },

  reducers: {
    setViewType(state, payload) {
      return {
        ...state,
        viewType: payload.payload,
      };
    },

    resetSearchParam(state) {
      return { ...state, metadata: { ...state.metadata, ...initSearchEventsAI } };
    },

    save(state, { payload: { data: list, metadata } }) {
      return { ...state, list, metadata: { ...state.metadata, ...metadata } };
    },

    saveSearchParam(state, { payload }) {
      return { ...state, metadata: { ...state.metadata, ...payload } };
    },
  },

  effects: {
    *fetchAll({ payload }, { call, put }) {
      try {
        const response = yield call(EventAiAPI.getAllEvents, payload);
        yield put({
          type: 'save',
          payload: {
            data: response.payload,
            metadata: response.metadata,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
