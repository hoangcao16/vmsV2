import UserApi from '@/services/user/UserApi';

export default {
  namespace: 'userGroup',
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
    *fetchAllUserGroup({ payload }, { call, put }) {
      const response = yield call(UserApi.getAllUserGroup, payload);
      yield put({
        type: 'save',
        payload: {
          data: response?.payload,
          metadata: response?.metadata,
        },
      });
    },

    *patch({ payload: { id, values } }, { call, put, select }) {
      yield call(UserApi.updateUserGroup, id, values);
      const oldList = yield select((state) => state.userGroup.list);
      const metadata = yield select((state) => state.userGroup.metadata);

      const userGroupIndex = oldList.findIndex((userG) => userG.uuid === id);

      if (userGroupIndex >= 0) {
        oldList[userGroupIndex] = { ...oldList[userGroupIndex], ...values };
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
      yield call(UserApi.deleteUserGroup, id);
      yield put({ type: 'reload' });
    },

    *create({ payload: values }, { call, put }) {
      yield call(UserApi.createUserGroup, values);
      yield put({ type: 'reload' });
    },

    *reload(action, { put, select }) {
      const page = yield select((state) => state.userGroup.page);
      yield put({ type: 'fetchAllUserGroup', payload: { page } });
    },
  },
};