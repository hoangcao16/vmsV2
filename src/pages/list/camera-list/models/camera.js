import cameraApi from '@/services/controller-api/cameraService';

export default {
  namespace: 'camera',
  state: {
    list: [],
    metadata: {
      total: 0,
      page: 1,
      size: 10,
    },
  },
  reducers: {
    save(state, { payload: { data: list, metadata } }) {
      return { ...state, list, metadata };
    },
  },
  effects: {
    *fetchAllCamera({ payload }, { call, put }) {
      const request = yield call(cameraApi.getAll, payload);
      yield put({
        type: 'save',
        payload: {
          data: request?.data?.payload,
          metadata: request?.data?.metadata,
        },
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        const metadata = {
          page: query.page || 1,
          size: query.size || 10,
        };
        if (pathname === '/list/camera-list') {
          dispatch({ type: 'fetchAllCamera', payload: metadata });
        }
      });
    },
  },
};
