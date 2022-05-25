import { notify } from '@/components/Notify';
import { STORAGE } from '@/constants/common';
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
    userAddingUuid: null,
  },
  reducers: {
    save(state, { payload: { data: list, metadata } }) {
      return { ...state, list, metadata };
    },
    saveUserUuid(state, { payload: { data: userAddingUuid } }) {
      return { ...state, userAddingUuid };
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
        yield call(UserApi.updateUser, id, values);

        notify(
          'success',
          'pages.setting-user.list-user.titleSuccess',
          'pages.setting-user.list-user.updateUserSuccess',
        );
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
        notify(
          'success',
          'pages.setting-user.list-user.titleSuccess',
          `pages.setting-user.list-user.${error?.code}`,
        );
      }
    },

    *remove({ payload: id }, { call, put }) {
      try {
        yield call(UserApi.deleteUser, id);
        notify(
          'success',
          'pages.setting-user.list-user.titleSuccess',
          'pages.setting-user.list-user.deleteUserSuccess',
        );
        //check res==>push notif
        yield put({ type: 'reload' });
      } catch (error) {
        console.log(error);
        notify(
          'success',
          'pages.setting-user.list-user.titleSuccess',
          `pages.setting-user.list-user.${error?.code}`,
        );
      }
    },

    *removeUserUuid(action, { put }) {
      yield put({
        type: 'saveUserUuid',
        payload: {
          data: null,
        },
      });
    },

    *create({ payload: values }, { call, put }) {
      try {
        const res = yield call(UserApi.createUser, values);

        yield put({
          type: 'saveUserUuid',
          payload: {
            data: res?.payload?.uuid,
          },
        });

        localStorage.setItem(STORAGE.USER_UUID_SELECTED, res?.payload?.uuid);

        notify(
          'success',
          'pages.setting-user.list-user.titleSuccess',
          'pages.setting-user.list-user.createUserSuccess',
        );
        //check res==>push notif
        yield put({ type: 'reload' });
      } catch (error) {
        console.log(error);
        notify(
          'success',
          'pages.setting-user.list-user.titleSuccess',
          `pages.setting-user.list-user.${error?.code}`,
        );
      }
    },

    *reload(action, { put, select }) {
      const page = yield select((state) => state.user.page);
      yield put({ type: 'fetchAllUser', payload: { page } });
    },
  },
};
