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
      try {
        const response = yield call(UserApi.getAllUser, payload);
        yield put({
          type: 'save',
          payload: {
            data: response?.payload,
            metadata: response?.metadata,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },

    *patch({ payload: { id, values } }, { call, put, select }) {
      try {
        const res = yield call(UserApi.updateUser, id, values);
        //check res==>push notif
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
      } catch (error) {
        console.log(error);
      }
    },

    *remove({ payload: id }, { call, put }) {
      try {
        const res = yield call(UserApi.deleteUser, id);
        //check res==>push notif
        yield put({ type: 'reload' });
      } catch (error) {
        console.log(error);
      }
    },

    *create({ payload: values }, { call, put }) {
      try {
        const res = yield call(UserApi.createUser, values);
        //check res==>push notif
        yield put({ type: 'reload' });
      } catch (error) {
        console.log(error);
      }
    },

    *reload(action, { put, select }) {
      const page = yield select((state) => state.user.page);
      yield put({ type: 'fetchAllUser', payload: { page } });
    },
  },
};
