import { Notification } from '@/components/Notify';
import NotiApi from '@/services/notification/NotiApi';

export default {
  namespace: 'noti',
  state: {
    list: [],
    count: 0,
  },
  reducers: {
    save(state, { payload: { data: list, sizeMessage: count } }) {
      return { ...state, count, list: [...state.list, ...list] };
    },
  },
  effects: {
    *fetchData({ payload }, { call, put }) {
      try {
        const response = yield call(NotiApi.getData, payload);
        yield put({
          type: 'save',
          payload: {
            data: response?.payload.messageInfo,
            sizeMessage: response?.payload.sizeMessage,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
