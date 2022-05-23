import { notify } from '@/components/Notify';
import cameraApi from '@/services/controller-api/cameraService';
import TagApi from '@/services/tag/tagApi';
import VendorApi from '@/services/vendor/VendorApi';

export default {
  namespace: 'category',
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
    *fetchAllVendor({ payload }, { call, put }) {
      try {
        const response = yield call(VendorApi.getAllVendor, payload);
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

    *fetchAllType({ payload }, { call, put }) {
      try {
        const response = yield call(cameraApi.getAllCameraTypes, payload);
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
    *fetchAllTags({ payload }, { call, put }) {
      try {
        const response = yield call(TagApi.getAllTags, payload);
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
  },
};
