import { notify } from '@/components/Notify';
import ModuleApi from '@/services/module-api/ModuleApi';

export default {
  namespace: 'camproxy',
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
    *fetchAllCamproxy({ payload }, { call, put }) {
      try {
        const response = yield call(ModuleApi.getAllCamproxy, payload);
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
    *editCamproxy({ payload: { id, values } }, { call, put }) {
      try {
        yield call(ModuleApi.editCamproxy, id, values);
        notify(
          'success',
          'pages.setting-user.list-user.titleSuccess',
          'noti.successfully_edit_camproxy',
        );
        yield put({ type: 'reload' });
      } catch (error) {
        console.log(error);
      }
    },
    *reload(action, { put, select }) {
      const metadata = yield select((state) => state.camproxy.metadata);
      yield put({
        type: 'fetchAllCamproxy',
        payload: { page: metadata?.page, size: metadata?.size },
      });
    },
  },
};
