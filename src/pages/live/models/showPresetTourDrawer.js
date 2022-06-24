export default {
  namespace: 'showPresetTourDrawer',
  state: {
    showDrawerAddEditPresetTour: false,
    showDrawerDetailsPresetTour: false,
    selectedPresetTour: null,
  },
  reducers: {
    //AddEditPresetTour
    openDrawerAddEditPresetTour(state, { payload: { selectedPresetTour } }) {
      return { ...state, showDrawerAddEditPresetTour: true, selectedPresetTour };
    },
    closeDrawerAddEditPresetTour(state) {
      return { ...state, showDrawerAddEditPresetTour: false, selectedPresetTour: null };
    },
  },
  effects: {
    *openDrawerAddEditPresetTour({ payload: { selectedPresetTour } }, { put }) {
      try {
        yield put({
          type: 'showDrawerAddEditPresetTour',
          payload: { selectedPresetTour },
        });
      } catch (error) {}
    },
    *closeDrawerAddEditPresetTour({ payload: {} }, { put }) {
      try {
        yield put({
          type: 'closeDrawerAddEditPresetTour',
        });
      } catch (error) {}
    },
  },
};
