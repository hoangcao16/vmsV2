import { notify } from '@/components/Notify';
import AdDivisionApi from '@/services/advision/AdDivision';

export default {
  namespace: 'advision',
  state: {
    list: [],
    metadata: {
      name: '',
      size: 100,
    },
  },
  reducers: {
    save(state, { payload: { data: list, metadata } }) {
      return { ...state, list, metadata };
    },
  },
  effects: {
    *fetchAll({ payload }, { call, put }) {
      try {
        console.log('payload', payload);

        const response = yield call(AdDivisionApi.getAll, payload);
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
        yield call(AdDivisionApi.addAdDivision, payload);
        notify(
          'success',
          'pages.setting-user.list-user.titleSuccess',
          'noti.successfully_add_administrative',
        );
        yield put({ type: 'reload' });
      } catch (error) {
        notify('error', 'pages.setting-user.list-user.titleErrors');
      }
    },

    *edit({ payload: { id, values } }, { call, put }) {
      try {
        yield call(AdDivisionApi.editAdDivision, id, values);
        notify('success', 'noti.success', 'noti.successfully_edit_administrative_unit');

        yield put({ type: 'reload' });
      } catch (error) {
        notify('error', 'pages.setting-user.list-user.titleErrors');
      }
    },

    *delete({ id }, { call, put }) {
      try {
        yield call(AdDivisionApi.deleteAdDivision, id);
        notify('success', 'noti.success', 'noti.successfully_delete_administrative');

        yield put({ type: 'reload' });
      } catch (error) {
        notify('error', 'pages.setting-user.list-user.titleErrors');
      }
    },

    *reload(action, { put, select }) {
      const size = yield select((state) => state.advision.size);
      yield put({ type: 'fetchAll', payload: { size } });
    },
  },
};
