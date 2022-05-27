import cameraApi from '@/services/controller-api/cameraService';
export default {
  namespace: 'maps',
  state: {
    cameraList: [],
    cameraAIList: [],
    AdminisUnitList: [],
    metadata: {
      total: 0,
      page: 1,
      size: 200,
    },
  },
  reducers: {
    saveCameraList(state, { payload: { data, metadata } }) {
      return {
        ...state,
        cameraList: data,
        metadata,
      };
    },
    saveCameraAIList(state, { payload: { data, metadata } }) {
      return {
        ...state,
        cameraAIList: data,
        metadata,
      };
    },
    saveAdminisUnitList(state, { payload: { data, metadata } }) {
      return {
        ...state,
        AdminisUnitList: data,
        metadata,
      };
    },
  },
  effects: {
    *fetchCameraList({ payload }, { call, put }) {
      try {
        const response = yield call(cameraApi.getAll, payload);
        yield put({
          type: 'saveCameraList',
          payload: {
            data: response?.payload,
            metadata: response?.metadata,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
