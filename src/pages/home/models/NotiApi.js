import { Notification } from '@/components/Notify';
import UserApi from '@/services/user/UserApi';

export default {
  namespace: 'noti',
  state: {
    list: [],
  },
  reducers: {
    save(state, { payload: { data: list } }) {
      return { ...state, list };
    },
  },
  effects: {
    *fetchData({ payload }, { call, put }) {
      try {
        const response = yield call(UserApi.getAllUser, payload);
        yield put({
          type: 'save',
          payload: {
            data: response?.payload,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
