import { notify } from '@/components/Notify';
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
      try {
        const response = yield call(UserApi.getAllUserRole, payload);
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
        const res = yield call(UserApi.updateUserRole, id, values);
        //check res==>push notif
        if (res?.code === 600) {
          notify(
            'success',
            'pages.setting-user.list-user.titleSuccess',
            'pages.setting-user.list-user.updateRoleSuccess',
          );
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
        } else {
          notify(
            'error',
            'pages.setting-user.list-user.titleErrors',
            `pages.setting-user.list-user.${res?.code}`,
          );
        }
        // yield put({ type: 'reload' });
      } catch (error) {
        console.log(error);
      }
    },

    *remove({ payload: id }, { call, put }) {
      try {
        const res = yield call(UserApi.deleteRole, id);
        //check res==>push notif
        if (res?.code === 600) {
          notify(
            'success',
            'pages.setting-user.list-user.titleSuccess',
            'pages.setting-user.list-user.removeRoleSuccess',
          );
          yield put({ type: 'reload' });
        } else {
          notify(
            'error',
            'pages.setting-user.list-user.titleErrors',
            `pages.setting-user.list-user.${res?.code}`,
          );
        }
      } catch (error) {
        console.log(error);
      }
    },

    *create({ payload: values }, { call, put }) {
      try {
        const res = yield call(UserApi.createRole, values);
        if (res?.code === 600) {
          notify(
            'success',
            'pages.setting-user.list-user.titleSuccess',
            'pages.setting-user.list-user.createRoleSuccess',
          );
          yield put({ type: 'reload' });
        } else {
          notify(
            'error',
            'pages.setting-user.list-user.titleErrors',
            `pages.setting-user.list-user.${res?.code}`,
          );
        }
      } catch (error) {
        console.log(error);
      }
    },

    *reload(action, { put, select }) {
      const page = yield select((state) => state.userRole.page);
      yield put({ type: 'fetchAllUserRole', payload: { page } });
    },
  },
};
