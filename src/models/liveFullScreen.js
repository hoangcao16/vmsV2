export default {
  namespace: 'liveFullScreen',
  state: {
    isOpenDrawer: false,
    selectedCamera: {},
  },
  reducers: {
    saveSelectedCamera(state, { payload }) {
      return { ...state, selectedCamera: payload, isOpenDrawer: true };
    },
    closeDrawer(state) {
      return { ...state, isOpenDrawer: false, selectedCamera: {} };
    },
  },
};
