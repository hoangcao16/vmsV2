import UserApi from '@/services/user/UserApi';

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
      const response = yield call(UserApi.getAllUser, payload);
      yield put({
        type: 'save',
        payload: {
          data: response?.payload,
          metadata: response?.metadata,
        },
      });
    },

    *patch({ payload: { id, values } }, { call, put, select }) {
      yield call(UserApi.updateUser, id, values);
      const oldList = yield select((state) => state.user.list);
      const metadata = yield select((state) => state.user.metadata);

      const userIndex = oldList.findIndex((user) => user.uuid === id);

      if (userIndex >= 0) {
        oldList[userIndex] = { ...oldList[userIndex], ...values };
      }

      const newList = [...oldList];

      yield put({
        type: 'save',
        payload: {
          data: newList,
          metadata: metadata,
        },
      });
      // yield put({ type: 'reload' });
    },

    *remove({ payload: id }, { call, put }) {
      yield call(UserApi.deleteUser, id);
      yield put({ type: 'reload' });
    },

    *create({ payload: values }, { call, put }) {
      yield call(UserApi.createUser, values);
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
