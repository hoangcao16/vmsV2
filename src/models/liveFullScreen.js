import cameraApi from '@/services/controllerApi/cameraService';
export default {
  namespace: 'liveFullScreen',
  state: {
    isOpenDrawer: false,
    selectedCamera: {},
    cameraList: [],
    metadata: {
      total: 0,
      page: 1,
      size: 1000,
    },
  },
  reducers: {
    saveSelectedCamera(state, { payload }) {
      return { ...state, selectedCamera: payload, isOpenDrawer: true };
    },
    closeDrawer(state) {
      return { ...state, isOpenDrawer: false, selectedCamera: {} };
    },
    saveCameraList(state, { payload: { data, metadata } }) {
      return {
        ...state,
        cameraList: data,
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
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        const data = {
          page: 1,
          size: 1000,
        };
        if (pathname !== '/user/login' && pathname !== '/user/register') {
          dispatch({ type: 'fetchCameraList', payload: data });
        }
      });
    },
  },
};
