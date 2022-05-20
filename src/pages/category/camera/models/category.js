import { notify } from '@/components/Notify';
import cameraApi from '@/services/controller-api/cameraService';
import TagApi from '@/services/tag/tagApi';
import VendorApi from '@/services/vendor/VendorApi';

export default {
  namespace: 'category',
  state: {
    listVendor: [],
    listType: [],
    listTags: [],
    metadata: {
      name: '',
      size: 100,
    },
  },
  reducers: {
    saveVendor(state, { payload: { data: listVendor, metadata } }) {
      return { ...state, listVendor, metadata };
    },
    saveType(state, { payload: { data: listType, metadata } }) {
      return { ...state, listType, metadata };
    },
    saveTags(state, { payload: { data: listTags, metadata } }) {
      return { ...state, listTags, metadata };
    },
  },
  effects: {
    *fetchAllVendor({ payload }, { call, put }) {
      try {
        const response = yield call(VendorApi.getAllVendor, payload);
        yield put({
          type: 'saveVendor',
          payload: {
            data: response?.payload,
            metadata: response?.metadata,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },

    *fetchAllType({ payload }, { call, put }) {
      try {
        const response = yield call(cameraApi.getAllCameraTypes, payload);
        yield put({
          type: 'saveType',
          payload: {
            data: response?.payload,
            metadata: response?.metadata,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    *fetchAllTags({ payload }, { call, put }) {
      try {
        const response = yield call(TagApi.getAllTags, payload);
        yield put({
          type: 'saveTags',
          payload: {
            data: response?.payload,
            metadata: response?.metadata,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },

    *addVendor({ payload }, { call, put }) {
      try {
        yield call(VendorApi.addVendor, payload);
        notify('success', 'pages.setting-user.list-user.titleSuccess', 'noti.successfully_add');
        yield put({ type: 'reloadVendor' });
      } catch (error) {
        notify(
          'error',
          'pages.setting-user.list-user.titleErrors',
          `pages.setting-user.list-user.${error?.code}`,
        );
      }
    },
    *editVendor({ payload: { id, values } }, { call, put }) {
      try {
        yield call(VendorApi.editVendor, id, values);
        notify(
          'success',
          'pages.setting-user.list-user.titleSuccess',
          'noti.successfully_edit_name',
        );
        yield put({ type: 'reloadVendor' });
      } catch (error) {
        notify(
          'error',
          'pages.setting-user.list-user.titleErrors',
          `pages.setting-user.list-user.${error?.code}`,
        );
      }
    },
    *deleteVendor({ id }, { call, put }) {
      try {
        yield call(VendorApi.delete, id);
        notify('success', 'pages.setting-user.list-user.titleSuccess', 'noti.delete_successful');
        yield put({ type: 'reloadVendor' });
      } catch (error) {
        console.log('error', error);

        notify(
          'error',
          'pages.setting-user.list-user.titleErrors',
          `pages.setting-user.list-user.${error?.code}`,
        );
      }
    },

    *reloadVendor(action, { put, select }) {
      yield put({ type: 'fetchAllVendor', payload: { size: 100 } });
    },
  },
};
