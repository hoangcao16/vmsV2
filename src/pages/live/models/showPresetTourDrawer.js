import PTZApi from '@/services/ptz/PTZApi';

export default {
  namespace: 'showPresetTourDrawer',
  state: {
    showDrawerAddEditPresetTour: false,
    showDrawerDetailsPresetTour: false,
    selectedPresetTour: null,
  },
  reducers: {
    //AddEditPresetTour
    handleShowDrawerAddEditPresetTour(state, { payload: { selectedPresetTour } }) {
      return { ...state, showDrawerAddEditPresetTour: true, selectedPresetTour };
    },
    handleCloseDrawerAddEditPresetTour(state) {
      return { ...state, showDrawerAddEditPresetTour: false, selectedPresetTour: null };
    },

    handleShowDrawerDetailsPresetTour(state, { payload: { selectedPresetTour } }) {
      return { ...state, showDrawerDetailsPresetTour: true, selectedPresetTour };
    },
    handleCloseDrawerDetailsPresetTour(state) {
      return { ...state, showDrawerDetailsPresetTour: false, selectedPresetTour: null };
    },

    handleEditPresetTour(state) {
      return {
        ...state,
        showDrawerDetailsPresetTour: false,
        showDrawerAddEditPresetTour: true,
      };
    },
  },
  effects: {
    *openDrawerAddEditPresetTour({ payload: { selectedPresetTour } }, { put }) {
      try {
        yield put({
          type: 'handleShowDrawerAddEditPresetTour',
          payload: { selectedPresetTour },
        });
      } catch (error) {}
    },
    *closeDrawerAddEditPresetTour({ payload }, { put }) {
      try {
        yield put({
          type: 'handleCloseDrawerAddEditPresetTour',
        });
      } catch (error) {}
    },

    // =========================================================================

    *openDrawerDetailsPresetTour({ payload: { selectedPresetTour } }, { put }) {
      try {
        yield put({
          type: 'handleShowDrawerDetailsPresetTour',
          payload: { selectedPresetTour },
        });
      } catch (error) {}
    },

    *closeDrawerDetailsPresetTour({ payload }, { put }) {
      try {
        yield put({
          type: 'handleCloseDrawerDetailsPresetTour',
        });
      } catch (error) {}
    },

    // ============================================================================

    *editPresetTour({ payload }, { put }) {
      try {
        yield put({
          type: 'handleEditPresetTour',
        });
      } catch (error) {}
    },

    *deletePresetTour({ payload: { body } }, { put, call }) {
      try {
        yield call(PTZApi.deletePresetTour, body);

        const camera = yield select((state) => state.live.cameraSelected || {});

        yield put({ type: 'live/openDrawerSettingCamera', payload: { camera } });

        yield put({
          type: 'handleCloseDrawerDetailsPreset',
        });
      } catch (error) {
        yield put({
          type: 'handleCloseDrawerDetailsPreset',
        });
      }
    },
  },
};
