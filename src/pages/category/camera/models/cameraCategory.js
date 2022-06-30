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
    metadataVendor: { page: 1, size: 10 },
    metadataType: { page: 1, size: 10 },
    metadataTags: { page: 1, size: 10 },
  },
  reducers: {
    saveVendor(state, { payload: { data: listVendor, metadataVendor } }) {
      return { ...state, listVendor, metadataVendor };
    },
    saveType(state, { payload: { data: listType, metadataType } }) {
      return { ...state, listType, metadataType };
    },
    saveTags(state, { payload: { data: listTags, metadataTags } }) {
      return { ...state, listTags, metadataTags };
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
            metadataVendor: response?.metadata,
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
            metadataType: response?.metadata,
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
            metadataTags: response?.metadata,
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
        console.log(error);
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
        console.log('error', error);
      }
    },
    *deleteVendor({ id }, { call, put }) {
      try {
        yield call(VendorApi.delete, id);
        notify('success', 'pages.setting-user.list-user.titleSuccess', 'noti.delete_successful');
        yield put({ type: 'reloadVendor' });
      } catch (error) {
        console.log('error', error);
      }
    },
    *reloadVendor(action, { put, select }) {
      const metadataVendor = yield select((state) => state.cameraCategory.metadataVendor);
      yield put({
        type: 'fetchAllVendor',
        payload: { page: metadataVendor?.page, size: metadataVendor?.size },
      });
    },

    *addType({ payload }, { call, put }) {
      try {
        yield call(cameraApi.addCameraTypes, payload);
        notify('success', 'pages.setting-user.list-user.titleSuccess', 'noti.successfully_add');
        yield put({ type: 'reloadType' });
      } catch (error) {
        console.log('error', error);
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
        console.log('error', error);
      }
    },

    *deleteType({ id }, { call, put }) {
      try {
        yield call(cameraApi.deleteCameraTypes, id);
        notify('success', 'pages.setting-user.list-user.titleSuccess', 'noti.delete_successful');
        yield put({ type: 'reloadType' });
      } catch (error) {
        console.log('error', error);
      }
    },

    *reloadType(action, { put, select }) {
      const metadataType = yield select((state) => state.cameraCategory.metadataType);
      yield put({
        type: 'fetchAllType',
        payload: { page: metadataType?.page, size: metadataType?.size },
      });
    },

    *addTags({ payload }, { call, put }) {
      try {
        yield call(TagApi.addTag, payload);
        notify('success', 'pages.setting-user.list-user.titleSuccess', 'noti.successfully_add');
        yield put({ type: 'reloadTags' });
      } catch (error) {
        console.log('error', error);
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
        console.log('error', error);
      }
    },

    *deleteTags({ id }, { call, put }) {
      try {
        yield call(TagApi.deleteTagById, id);
        notify('success', 'pages.setting-user.list-user.titleSuccess', 'noti.delete_successful');
        yield put({ type: 'reloadTags' });
      } catch (error) {
        console.log('error', error);
      }
    },

    *reloadTags(action, { put, select }) {
      const metadataTags = yield select((state) => state.cameraCategory.metadataTags);
      yield put({
        type: 'fetchAllTags',
        payload: { page: metadataTags?.page, size: metadataTags?.size },
      });
    },
  },
};
