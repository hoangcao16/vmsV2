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
    *closeDrawerAddEditPreset({ payload: {} }, { put }) {
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
    *closeDrawerDetailsPreset({ payload: {} }, { put }) {
      try {
        yield put({
          type: 'handleCloseDrawerDetailsPreset',
        });
      } catch (error) {}
    },
  },
};
