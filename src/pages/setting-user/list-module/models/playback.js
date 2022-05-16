import { NotificationError, NotificationSuccess } from '@/components/Notify';
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
    *editPlayback({ playbackId, payload }, { call, put }) {
      try {
        const res = yield call(ModuleApi.editPlayback, playbackId, payload);
        console.log('res', !!res);

        if (res) {
          NotificationSuccess('Chỉnh sửa Playback thành công');
        } else {
          NotificationError('Đã xảy ra lỗi');
        }
        yield put({ type: 'reload' });
      } catch (error) {
        console.log(error);
        NotificationError('Đã xảy ra lỗi');
      }
    },
    *reload(action, { put, select }) {
      const page = yield select((state) => state.playback.page);
      yield put({ type: 'fetchAllPlayback', payload: { page } });
    },
  },
};
