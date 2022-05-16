import { message } from '@umijs/plugin-request/lib/ui';
import ModuleApi from '@/services/module-api/ModuleApi';
import { NotificationError, NotificationSuccess } from '@/components/Notify';
import { useIntl } from 'umi';

export default {
  namespace: 'nvr',
  state: {
    list: [],
    metadata: {
      name: '',
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
    *fetchAllNVR({ payload }, { call, put }) {
      try {
        const response = yield call(ModuleApi.getAllNVR, payload);
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
    *editNVR({ nvrId, payload }, { call, put }) {
      try {
        const res = yield call(ModuleApi.editNVR, nvrId, payload);

        if (res) {
          NotificationSuccess('Chỉnh sửa NVR thành công');
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
      const page = yield select((state) => state.nvr.page);
      yield put({ type: 'fetchAllNVR', payload: { page } });
    },
  },
};
