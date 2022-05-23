import DailyArchiveApi from '@/services/storage-api/DailyArchiveApi';
import eventFilesApi from '@/services/storage-api/eventFilesApi';

export const initSearchEventFiles = {
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
  eventUuid: 'notnull',
  searchType: '',
  searchValue: '',
};

export default {
  namespace: 'eventFiles',
  state: {
    list: [],
    metadata: {
      page: 1,
      size: 10,
      total: 0,
      ...initSearchEventFiles,
    },
  },

  reducers: {
    save(state, { payload: { data: list, metadata } }) {
      return { ...state, list, metadata: { ...state.metadata, ...metadata } };
    },

    saveSearchParam(state, { payload }) {
      return { ...state, metadata: { ...state.metadata, ...payload } };
    },
  },

  effects: {
    *fetchAllEventFiles({ payload }, { call, put }) {
      try {
        const response = yield call(eventFilesApi.getAllEventFiles, payload);
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
