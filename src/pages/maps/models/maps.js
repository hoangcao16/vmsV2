import cameraApi from '@/services/controllerApi/cameraService';
import AdDivisionApi from '@/services/advisionApi';
export default {
  namespace: 'maps',
  state: {
    list: [],
    type: 'camera',
    metadata: {
      total: 0,
      page: 1,
      size: 10000,
    },
    isOpenCameraListDrawer: false,
  },
  reducers: {
    saveList(state, { payload: { data, metadata } }) {
      return {
        ...state,
        list: data,
        metadata,
      };
    },
    saveType(state, { payload }) {
      return {
        ...state,
        type: payload,
      };
    },
    saveIsOpenCameraListDrawer(state, { payload }) {
      return {
        ...state,
        isOpenCameraListDrawer: payload,
      };
    },
  },
  effects: {
    *fetchCameraList({ payload }, { call, put }) {
      try {
        yield put({
          type: 'saveType',
          payload: 'camera',
        });
        const response = yield call(cameraApi.getAll, payload);
        yield put({
          type: 'saveList',
          payload: {
            data: response?.payload,
            metadata: response?.metadata,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    *fetchAllAdDivisions({ payload }, { call, put }) {
      try {
        yield put({
          type: 'saveType',
          payload: 'adminisUnit',
        });
        const response = yield call(AdDivisionApi.getAllAdDivision, payload);
        yield put({
          type: 'saveList',
          payload: {
            data: response?.payload,
            metadata: response?.metadata,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    *fetchAllCameraAI({ payload }, { call, put }) {
      try {
        yield put({
          type: 'saveType',
          payload: 'cameraAI',
        });
        const response = yield call(cameraApi.getAllAI, payload);
        yield put({
          type: 'saveList',
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
