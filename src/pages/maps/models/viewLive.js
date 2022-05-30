import camLiveApi from '@/services/controllerApi/cameraLiveService';
export default {
  namespace: 'viewLiveCameras',
  state: {
    liveCameraList: [],
    listStreaming: [],
  },
  reducers: {
    saveLiveCameraList(state, { payload }) {
      return {
        ...state,
        liveCameraList: payload,
      };
    },
    saveListStreaming(state, { payload }) {
      return {
        ...state,
        listStreaming: payload,
      };
    },
  },
  effects: {
    *fetchLiveCameraList({ payload }, { call, put }) {
      try {
        const response = yield call(camLiveApi.getAll, payload);
        yield put({
          type: 'saveLiveCameraList',
          payload: response?.payload[0]?.cameraUuids,
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/map') {
          dispatch({
            type: 'fetchLiveCameraList',
            payload: {
              page: 1,
              size: 10,
              type: '4x1',
            },
          });
        }
      });
    },
  },
};
