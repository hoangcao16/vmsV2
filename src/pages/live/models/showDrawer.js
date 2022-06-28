import PTZApi from '@/services/ptz/PTZApi';

export default {
  namespace: 'showDrawer',
  state: {
    showDrawerAddEditPreset: false,
    showDrawerDetailsPreset: false,
    selectedPreset: null,
  },
  reducers: {
    //AddEditPreset
    handleShowDrawerAddEditPreset(state, { payload: { selectedPreset } }) {
      return { ...state, showDrawerAddEditPreset: true, selectedPreset };
    },
    handleCloseDrawerAddEditPreset(state) {
      return { ...state, showDrawerAddEditPreset: false, selectedPreset: null };
    },

    handleShowDrawerDetailsPreset(state, { payload: { selectedPreset } }) {
      return { ...state, showDrawerDetailsPreset: true, selectedPreset };
    },
    handleCloseDrawerDetailsPreset(state) {
      return { ...state, showDrawerDetailsPreset: false, selectedPreset: null };
    },

    handleEditPreset(state) {
      return {
        ...state,
        showDrawerDetailsPreset: false,
        showDrawerAddEditPreset: true,
      };
    },
  },
  effects: {
    *openDrawerAddEditPreset({ payload: { selectedPreset } }, { put }) {
      try {
        yield put({
          type: 'handleShowDrawerAddEditPreset',
          payload: { selectedPreset },
        });
      } catch (error) {}
    },
    *closeDrawerAddEditPreset({ payload }, { put }) {
      try {
        yield put({
          type: 'handleCloseDrawerAddEditPreset',
        });
      } catch (error) {}
    },

    *openDrawerDetailsPreset({ payload: { selectedPreset } }, { put }) {
      try {
        yield put({
          type: 'handleShowDrawerDetailsPreset',
          payload: { selectedPreset },
        });
      } catch (error) {}
    },

    *closeDrawerDetailsPreset({ payload }, { put }) {
      try {
        yield put({
          type: 'handleCloseDrawerDetailsPreset',
        });
      } catch (error) {}
    },

    *editPreset({ payload }, { put }) {
      try {
        yield put({
          type: 'handleEditPreset',
        });
      } catch (error) {}
    },

    *deletePreset({ payload: { body } }, { put, call }) {
      try {
        yield call(PTZApi.deletePreset, body);

        const camera = yield select((state) => state.live.cameraSelected || {});

        yield put({ type: 'live/openDrawerSettingCamera', payload: { camera } });

        yield put({
          type: 'handleCloseDrawerDetailsPresetTour',
        });
      } catch (error) {
        yield put({
          type: 'handleCloseDrawerDetailsPresetTour',
        });
      }
    },
  },
};
