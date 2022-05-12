import UserApi from '@/services/user/UserApi';

export default {
  namespace: 'userRole',
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
    *fetchAllUserRole({ payload }, { call, put }) {
      const response = yield call(UserApi.getAllUserRole, payload);
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
      const oldList = yield select((state) => state.userRole.list);
      const metadata = yield select((state) => state.userRole.metadata);

      const roleIndex = oldList.findIndex((role) => role.uuid === id);

      if (roleIndex >= 0) {
        oldList[roleIndex] = { ...oldList[roleIndex], ...values };
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

    // *remove({ payload: id }, { call, put }) {
    //   yield call(UserApi.deleteUser, id);
    //   yield put({ type: 'reload' });
    // },

    *create({ payload: values }, { call, put }) {
      yield call(UserApi.createRole, values);
      yield put({ type: 'reload' });
    },

    *reload(action, { put, select }) {
      const page = yield select((state) => state.userRole.page);
      yield put({ type: 'fetchAllUserRole', payload: { page } });
    },
  },
};
