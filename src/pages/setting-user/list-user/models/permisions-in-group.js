import UserApi from '@/services/user/UserApi';
import getCurrentLocale from '@/utils/Locale';

export default {
  namespace: 'premissionInGroup',
  state: {
    list: [],
    metadata: {},
    groupCode: null,
    allPermission: [],
  },
  reducers: {
    save(state, { payload: { data: list, metadata, groupCode } }) {
      return { ...state, list, metadata, groupCode };
    },
    saveAllPermission(state, { payload: { data: allPermission } }) {
      return { ...state, allPermission };
    },
  },
  effects: {
    *fetchAllPermissionInGroup({ payload: { code } }, { call, put, select }) {
      try {
        const res = yield call(UserApi.getAllUserInGroupById, code);

        yield put({
          type: 'save',
          payload: {
            data: res?.payload?.p_others,
            metadata: { ...res?.metadata },
            groupCode: res?.payload?.group_code,
          },
        });
      } catch (error) {
        console.error(error);
      }
    },

    *fetchAllPermission({ payload: { lang } }, { call, put, select }) {
      try {
        const res = yield call(UserApi.getAllPermission, lang);

        const permissionRemoveMonitoring = res?.payload?.filter((r) => r.code !== 'monitoring');

        const finalPermission = permissionRemoveMonitoring.map((p) => {
          return {
            code: p?.code,
            name: p?.name,
            children: p?.permissions.map((p) => {
              return {
                code: p?.code,
                name: p?.name,
              };
            }),
          };
        });

        yield put({
          type: 'saveAllPermission',
          payload: {
            data: finalPermission,
          },
        });
      } catch (error) {
        console.error(error);
      }
    },

    *remove({ payload: dataRemove }, { call, put }) {
      try {
        const res = yield call(UserApi.removePermissionInGroup, dataRemove);
        yield put({ type: 'reload' });
      } catch (error) {}
    },
    // ================================================================
    //set quyen le cho camera
    *removePermisionGroup({ payload: dataRM }, { call, put }) {
      try {
        const res = yield call(UserApi.removePermisionGroup, dataRM);
        yield put({ type: 'reload' });
        yield put({ type: 'reloadFetchAllPermission' });
      } catch (error) {}
    },
    //set quyen le cho camera
    *setPermisionGroup({ payload: payloadAdd }, { call, put }) {
      try {
        const res = yield call(UserApi.setPermisionGroup, payloadAdd);
        yield put({ type: 'reload' });
        yield put({ type: 'reloadFetchAllPermission' });
      } catch (error) {}
    },
    // ==================================================================

    *reload(action, { put, select }) {
      const code = yield select((state) => state.premissionInGroup.groupCode);

      yield put({ type: 'fetchAllPermissionInGroup', payload: { code } });
    },

    *reloadFetchAllPermission(action, { put, select }) {
      yield put({ type: 'fetchAllPermission', payload: { lang: getCurrentLocale() } });
    },
  },
};
