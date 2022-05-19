import { notify } from '@/components/Notify';
import ModuleApi from '@/services/module-api/ModuleApi';

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
    *editNVR({ payload: { id, values } }, { call, put }) {
      try {
        const res = yield call(ModuleApi.editNVR, id, values);
        if (res?.code === 700 || res?.code === 800) {
          notify(
            'success',
            'pages.setting-user.list-user.titleSuccess',
            'noti.successfully_edit_nvr',
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
      const page = yield select((state) => state.nvr.page);
      yield put({ type: 'fetchAllNVR', payload: { page } });
    },
  },
};
