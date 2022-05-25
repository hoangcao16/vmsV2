import AddressApi from '@/services/address/AddressApi';
import AdDivisionApi from '@/services/advision/AdDivision';
import cameraApi from '@/services/controller-api/cameraService';
import FieldEventApi from '@/services/fieldEvent/FieldEventApi';
import TagApi from '@/services/tag/tagApi';
import VendorApi from '@/services/vendor/VendorApi';
import ZoneApi from '@/services/zone/ZoneApi';

export default {
  namespace: 'globalstore',
  state: {
    cameraTypesOptions: [],
    groupCameraOptions: [],
    zonesOptions: [],
    adDivisionsOptions: [],
    vendorsOptions: [],
    tagsOptions: [],
    provincesOptions: [],
    fieldsOptions: [],
  },

  reducers: {
    saveCameraTypes(state, { payload }) {
      return {
        ...state,
        cameraTypesOptions: payload,
      };
    },
    saveGroupCamera(state, { payload }) {
      return {
        ...state,
        groupCameraOptions: payload,
      };
    },
    saveZones(state, { payload }) {
      return {
        ...state,
        zonesOptions: payload,
      };
    },
    saveAdDivisions(state, { payload }) {
      return {
        ...state,
        adDivisionsOptions: payload,
      };
    },
    saveVendors(state, { payload }) {
      return {
        ...state,
        vendorsOptions: payload,
      };
    },
    saveTags(state, { payload }) {
      return {
        ...state,
        tagsOptions: payload,
      };
    },
    saveProvinces(state, { payload }) {
      return { ...state, provincesOptions: payload };
    },
    saveFields(state, { payload }) {
      return { ...state, fieldsOptions: payload };
    },
  },

  effects: {
    *fetchAllCameraTypes({ payload }, { call, put }) {
      try {
        const response = yield call(cameraApi.getAllCameraTypes, payload);
        yield put({
          type: 'saveCameraTypes',
          payload: response?.payload,
        });
      } catch (error) {
        console.log(error);
      }
    },
    *fetchAllGroupCamera({ payload }, { call, put }) {
      try {
        const response = yield call(cameraApi.getAllGroupCamera, payload);
        yield put({
          type: 'saveGroupCamera',
          payload: response?.payload,
        });
      } catch (error) {
        console.log(error);
      }
    },
    *fetchAllZones({ payload }, { call, put }) {
      try {
        const response = yield call(ZoneApi.getAllZones, payload);
        yield put({
          type: 'saveZones',
          payload: response?.payload,
        });
      } catch (error) {
        console.log(error);
      }
    },
    *fetchAllAdDivisions({ payload }, { call, put }) {
      try {
        const response = yield call(AdDivisionApi.getAllAdDivision, payload);
        yield put({
          type: 'saveAdDivisions',
          payload: response?.payload,
        });
      } catch (error) {
        console.log(error);
      }
    },
    *fetchAllVendors({ payload }, { call, put }) {
      try {
        const response = yield call(VendorApi.getAllVendor, payload);
        yield put({
          type: 'saveVendors',
          payload: response?.payload,
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
          payload: response?.payload,
        });
      } catch (error) {
        console.log(error);
      }
    },
    *fetchAllProvinces({ payload }, { call, put }) {
      try {
        const response = yield call(AddressApi.getAllProvinces, payload);
        yield put({
          type: 'saveProvinces',
          payload: response?.payload,
        });
      } catch (error) {
        console.log(error);
      }
    },
    *fetchAllFields({ payload }, { call, put }) {
      try {
        const response = yield call(FieldEventApi.getAllFieldEvent);
        yield put({
          type: 'saveFields',
          payload: response?.payload,
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        const data = {
          name: '',
          id: '',
          provinceId: '',
          districtId: '',
          size: 1000,
        };
        if (pathname !== '/user/login' && pathname !== '/user/register') {
          dispatch({ type: 'fetchAllCameraTypes', payload: data });
          dispatch({ type: 'fetchAllGroupCamera', payload: data });
          dispatch({ type: 'fetchAllZones', payload: data });
          dispatch({ type: 'fetchAllAdDivisions', payload: data });
          dispatch({ type: 'fetchAllVendors', payload: data });
          dispatch({ type: 'fetchAllTags', payload: data });
          dispatch({ type: 'fetchAllProvinces', payload: data });
          dispatch({ type: 'fetchAllFields', payload: data });
        }
      });
    },
  },
};
