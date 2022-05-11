import AuthZApi from '@/services/authz/AuthZApi';

export default {
  namespace: 'user',
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
    *fetchAllUser({ payload }, { call, put }) {
      const response = yield call(AuthZApi.getAllUser, payload);
      yield put({
        type: 'save',
        payload: {
          data: response?.payload,
          metadata: response?.metadata,
        },
      });
    },

    *create({ payload: values }, { call, put }) {
      yield call(AuthZApi.createUser, values);
      yield put({ type: 'reload' });
    },

    *reload(action, { put, select }) {
      const page = yield select((state) => state.user.page);
      yield put({ type: 'fetchAllUser', payload: { page } });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        const metadata = {
          page: query.page || 1,
          size: query.size || 10,
        };
        if (pathname === '/setting-user/list-user') {
          dispatch({ type: 'fetchAllUser', payload: metadata });
        }
      });
    },
  },
};
