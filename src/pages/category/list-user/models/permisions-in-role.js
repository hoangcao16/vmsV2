import { notify } from '@/components/Notify';
import { STORAGE } from '@/constants/common';
import UserApi from '@/services/user/UserApi';
import getCurrentLocale from '@/utils/Locale';

export default {
  namespace: 'premissionInRole',
  state: {
    list: [],
    metadata: {},
    roleCode: null,
    allPermission: [],
  },
  reducers: {
    save(state, { payload: { data: list, metadata, roleCode } }) {
      return { ...state, list, metadata, roleCode };
    },
    saveAllPermission(state, { payload: { data: allPermission } }) {
      return { ...state, allPermission };
    },
  },
  effects: {
    *fetchAllPermissionInRole({ payload: { code } }, { call, put, select }) {
      try {
        const res = yield call(UserApi.getRoleByRoleCode, code);

        yield put({
          type: 'save',
          payload: {
            data: res?.payload?.p_others,
            metadata: { ...res?.metadata },
            roleCode: res?.payload?.role_code || localStorage.getItem(STORAGE.ROLE_CODE_SELECTED),
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
        const res = yield call(UserApi.removePermissionInRole, dataRemove);

        if (res?.code === 600) {
          notify(
            'success',
            'pages.setting-user.list-user.titleSuccess',
            'pages.setting-user.list-user.removePermisisionUserGroupSuccess',
          );
          yield put({ type: 'reload' });
        } else {
          notify(
            'error',
            'pages.setting-user.list-user.titleErrors',
            `pages.setting-user.list-user.${res?.code}`,
          );
        }
      } catch (error) {}
    },
    // ================================================================
    //set quyen le cho camera
    *removePermisionRole({ payload: dataRM }, { call, put }) {
      try {
        const res = yield call(UserApi.removePermisionRole, dataRM);
        if (res?.code === 600) {
          notify(
            'success',
            'pages.setting-user.list-user.titleSuccess',
            'pages.setting-user.list-user.updatePermisisionUserGroupSuccess',
          );
          yield put({ type: 'reload' });
          yield put({ type: 'reloadFetchAllPermission' });
        } else {
          notify(
            'error',
            'pages.setting-user.list-user.titleErrors',
            `pages.setting-user.list-user.${res?.code}`,
          );
        }
      } catch (error) {
        console.log(error);
      }
    },
    //set quyen le cho camera
    *setPermisionRole({ payload: payloadAdd }, { call, put }) {
      try {
        const res = yield call(UserApi.setPermisionRole, payloadAdd);
        if (res?.code === 600) {
          notify(
            'success',
            'pages.setting-user.list-user.titleSuccess',
            'pages.setting-user.list-user.updatePermisisionUserGroupSuccess',
          );
          yield put({ type: 'reload' });
          yield put({ type: 'reloadFetchAllPermission' });
        } else {
          notify(
            'error',
            'pages.setting-user.list-user.titleErrors',
            `pages.setting-user.list-user.${res?.code}`,
          );
        }
      } catch (error) {
        console.log(error);
      }
    },
    // ==================================================================

    *reload(action, { put, select }) {
      const code = yield select(
        (state) =>
          state.premissionInRole.roleCode || localStorage.getItem(STORAGE.ROLE_CODE_SELECTED),
      );

      yield put({ type: 'fetchAllPermissionInRole', payload: { code } });
    },

    *reloadFetchAllPermission(action, { put, select }) {
      yield put({ type: 'fetchAllPermission', payload: { lang: getCurrentLocale() } });
    },
  },
};
