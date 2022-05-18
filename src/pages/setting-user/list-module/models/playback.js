import { NotificationError, NotificationSuccess, notify } from '@/components/Notify';
import ModuleApi from '@/services/module-api/ModuleApi';

export default {
  namespace: 'playback',
  state: {
    list: [],
    metadata: {
      page: 1,
      size: 10,
      name: '',
    },
  },
  reducers: {
    save(state, { payload: { data: list, metadata } }) {
      return { ...state, list, metadata };
    },
  },
  effects: {
    *fetchAllPlayback({ payload }, { call, put }) {
      try {
        const response = yield call(ModuleApi.getAllPlayback, payload);

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
    *editPlayback({ payload: { id, values } }, { call, put }) {
      try {
        const res = yield call(ModuleApi.editPlayback, id, values);
        if (res?.code === 700 || res?.code === 600) {
          notify(
            'success',
            'pages.setting-user.list-user.titleSuccess',
            'noti.successfully_edit_playback',
          );
        }
        yield put({ type: 'reload' });
      } catch (error) {
        notify(
          'error',
          'pages.setting-user.list-user.titleErrors',
          `pages.setting-user.list-user.${res?.code}`,
        );
      }
    },
    *reload(action, { put, select }) {
      const page = yield select((state) => state.playback.page);
      yield put({ type: 'fetchAllPlayback', payload: { page } });
    },
  },
};
