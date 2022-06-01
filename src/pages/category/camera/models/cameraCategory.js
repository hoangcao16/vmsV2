import { notify } from '@/components/Notify';
import cameraApi from '@/services/controllerApi/cameraService';
import TagApi from '@/services/tagApi';
import VendorApi from '@/services/vendorApi';

export default {
  namespace: 'cameraCategory',
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

    *addType({ payload }, { call, put }) {
      try {
        yield call(cameraApi.addCameraTypes, payload);
        notify('success', 'pages.setting-user.list-user.titleSuccess', 'noti.successfully_add');
        yield put({ type: 'reloadType' });
      } catch (error) {
        notify(
          'error',
          'pages.setting-user.list-user.titleErrors',
          `pages.setting-user.list-user.${error?.code}`,
        );
      }
    },
    *editType({ payload: { id, values } }, { call, put }) {
      try {
        yield call(cameraApi.editCameraTypes, id, values);
        notify(
          'success',
          'pages.setting-user.list-user.titleSuccess',
          'noti.successfully_edit_name',
        );
        yield put({ type: 'reloadType' });
      } catch (error) {
        notify(
          'error',
          'pages.setting-user.list-user.titleErrors',
          `pages.setting-user.list-user.${error?.code}`,
        );
      }
    },

    *deleteType({ id }, { call, put }) {
      try {
        yield call(cameraApi.deleteCameraTypes, id);
        notify('success', 'pages.setting-user.list-user.titleSuccess', 'noti.delete_successful');
        yield put({ type: 'reloadType' });
      } catch (error) {
        console.log('error', error);

        notify(
          'error',
          'pages.setting-user.list-user.titleErrors',
          `pages.setting-user.list-user.${error?.code}`,
        );
      }
    },

    *reloadType(action, { put, select }) {
      yield put({ type: 'fetchAllType', payload: { size: 100 } });
    },

    *addTags({ payload }, { call, put }) {
      try {
        yield call(TagApi.addTag, payload);
        notify('success', 'pages.setting-user.list-user.titleSuccess', 'noti.successfully_add');
        yield put({ type: 'reloadTags' });
      } catch (error) {
        notify(
          'error',
          'pages.setting-user.list-user.titleErrors',
          `pages.setting-user.list-user.${error?.code}`,
        );
      }
    },

    *editTags({ payload: { id, values } }, { call, put }) {
      try {
        yield call(TagApi.updateTagById, id, values);
        notify(
          'success',
          'pages.setting-user.list-user.titleSuccess',
          'noti.successfully_edit_name',
        );
        yield put({ type: 'reloadTags' });
      } catch (error) {
        notify(
          'error',
          'pages.setting-user.list-user.titleErrors',
          `pages.setting-user.list-user.${error?.code}`,
        );
      }
    },

    *deleteTags({ id }, { call, put }) {
      try {
        yield call(TagApi.deleteTagById, id);
        notify('success', 'pages.setting-user.list-user.titleSuccess', 'noti.delete_successful');
        yield put({ type: 'reloadTags' });
      } catch (error) {
        console.log('error', error);

        notify(
          'error',
          'pages.setting-user.list-user.titleErrors',
          `pages.setting-user.list-user.${error?.code}`,
        );
      }
    },

    *reloadTags(action, { put, select }) {
      yield put({ type: 'fetchAllTags', payload: { size: 100 } });
    },
  },
};
