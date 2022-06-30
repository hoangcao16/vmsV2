import { notify } from '@/components/Notify';
import ModuleApi from '@/services/module-api/ModuleApi';

export default {
  namespace: 'zone',
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
    *fetchAllZone({ payload }, { call, put }) {
      try {
        const response = yield call(ModuleApi.getAllZone, payload);
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
    *addZone({ payload }, { call, put }) {
      try {
        yield call(ModuleApi.addZone, payload);
        notify(
          'success',
          'pages.setting-user.list-user.titleSuccess',
          'noti.successfully_add_zone',
        );
        yield put({ type: 'reload' });
      } catch (error) {
        console.log(error);
      }
    },
    *editZone({ payload: { id, values } }, { call, put }) {
      try {
        yield call(ModuleApi.editZone, id, values);
        notify(
          'success',
          'pages.setting-user.list-user.titleSuccess',
          'noti.successfully_edit_zone',
        );
        yield put({ type: 'reload' });
      } catch (error) {
        console.log(error);
      }
    },
    *deleteZone({ payload: { id } }, { call, put }) {
      try {
        yield call(ModuleApi.deleteZone, id);
        notify(
          'success',
          'pages.setting-user.list-user.titleSuccess',
          'noti.successfully_delete_zone',
        );
        yield put({ type: 'reload' });
      } catch (error) {
        console.log(error);
      }
    },
    *reload(action, { put, select }) {
      const metadata = yield select((state) => state.zone.metadata);
      yield put({ type: 'fetchAllZone', payload: { page: metadata?.page, size: metadata?.size } });
    },
  },
};
