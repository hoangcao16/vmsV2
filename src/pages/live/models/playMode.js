export default {
  namespace: 'playMode',
  state: {
    selectedCamera: null,
    isPlay: false,
  },
  reducers: {
    saveSelectedCamera(state, { payload }) {
      return { ...state, selectedCamera: payload };
    },
    saveIsPlay(state, { payload }) {
      return { ...state, isPlay: payload };
    },
  },
  effects: {},
};
