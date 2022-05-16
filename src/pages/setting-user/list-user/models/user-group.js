import { Notification } from '@/components/Notify';
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
      try {
        const response = yield call(UserApi.getAllUserGroup, payload);
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
        const res = yield call(UserApi.updateUserGroup, id, values);
        //check res==>push notif
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

        // Notification('success', 'titleSuccess', '600');
      } catch (error) {
        console.log(error);
      }
    },

    *remove({ payload: id }, { call, put }) {
      try {
        const res = yield call(UserApi.deleteUserGroup, id);
        //check res==>push notif
        yield put({ type: 'reload' });
      } catch (error) {
        console.log(error);
      }
    },

    *create({ payload: values }, { call, put }) {
      try {
        const res = yield call(UserApi.createUserGroup, values);
        //check res==>push notif
        yield put({ type: 'reload' });
      } catch (error) {
        console.log(error);
      }
    },

    *reload(action, { put, select }) {
      const page = yield select((state) => state.userGroup.page);
      yield put({ type: 'fetchAllUserGroup', payload: { page } });
    },
  },
};
