import { NotificationError, NotificationSuccess, notify } from '@/components/Notify';
import ModuleApi from '@/services/module-api/ModuleApi';

export default {
  namespace: 'playback',
  state: {
    list: [],
    metadata: {
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
        yield call(ModuleApi.editPlayback, id, values);
        notify(
          'success',
          'pages.setting-user.list-user.titleSuccess',
          'noti.successfully_edit_playback',
        );
        yield put({ type: 'reload' });
      } catch (error) {
        notify(
          'error',
          'pages.setting-user.list-user.titleErrors',
          `pages.setting-user.list-user.${error?.code}`,
        );
      }
    },
    *reload(action, { put, select }) {
      const metadata = yield select((state) => state.playback.metadata);
      yield put({
        type: 'fetchAllPlayback',
        payload: { page: metadata?.page, size: metadata?.size },
      });
    },
  },
};
