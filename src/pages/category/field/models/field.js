import { notify } from '@/components/Notify';
import FieldEventApi from '@/services/fieldEvent/FieldEventApi';

export default {
  namespace: 'field',
  state: {
    list: [],
    metadata: { page: 1, size: 10 },
  },
  reducers: {
    save(state, { payload: { data: list, metadata } }) {
      return { ...state, list, metadata };
    },
  },
  effects: {
    *fetchAllField({ payload }, { call, put }) {
      try {
        const response = yield call(FieldEventApi.getAllFieldEvent, payload);
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

    *add({ payload }, { call, put }) {
      try {
        yield call(FieldEventApi.addField, payload);
        notify('success', 'pages.setting-user.list-user.titleSuccess', 'noti.successfully_add');
        yield put({ type: 'reload' });
      } catch (error) {
        notify(
          'error',
          'pages.setting-user.list-user.titleErrors',
          `pages.setting-user.list-user.${error?.code}`,
        );
      }
    },

    *edit({ payload: { id, values } }, { call, put }) {
      try {
        yield call(FieldEventApi.editField, id, values);
        notify(
          'success',
          'pages.setting-user.list-user.titleSuccess',
          'noti.successfully_edit_name',
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

    *delete({ id }, { call, put }) {
      try {
        yield call(FieldEventApi.deleteField, id);
        notify('success', 'pages.setting-user.list-user.titleSuccess', 'noti.delete_successful');
        yield put({ type: 'reload' });
      } catch (error) {
        console.log('error', error);

        notify(
          'error',
          'pages.setting-user.list-user.titleErrors',
          `pages.setting-user.list-user.${error?.code}`,
        );
      }
    },

    *reload(action, { put, select }) {
      const metadata = yield select((state) => state.field.metadata);
      yield put({ type: 'fetchAllField', payload: { page: metadata?.page, size: metadata?.size } });
    },
  },
};
