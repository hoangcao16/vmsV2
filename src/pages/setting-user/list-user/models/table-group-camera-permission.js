import UserApi from '@/services/user/UserApi';
import getCurrentLocale from '@/utils/Locale';
import { isEmpty } from 'lodash';

export default {
  namespace: 'groupCameraPermissionInGroupUser',
  state: {
    listCameraGroupPermission: [],
    metadata: {},
    groupCode: null,
  },
  reducers: {
    save(state, { payload: { data: listCameraGroupPermission, metadata, groupCode } }) {
      return { ...state, listCameraGroupPermission, metadata, groupCode };
    },
  },
  effects: {
    *fetchAllPermissionCameraGroups({ payload: { code } }, { call, put, select }) {
      try {
        const resDataPermision = yield call(UserApi.getAllUserInGroupById, code);

        const allCameraGroups = yield call(UserApi.getAllCameraGroups, { page: 0, size: 10000 });

        const listPermissionCameraGroups = resDataPermision?.payload?.p_camera_groups;

        const convertDataRows = (data) => {
          const result = data.filter((p) => isEmpty(p.parent));

          return result.map((camG) => {
            const permision = camG?.permissions.map((p) => {
              return {
                [p]: 1,
              };
            });

            const permisionConvert = Object.assign({}, ...permision);

            return {
              ...permisionConvert,
              cam_group_uuid: camG?.cam_group_uuid,
              cam_group_name: camG?.cam_group_name,
              isDisableRow: false,
            };
          });
        };

        let cameraGroupsPerRows = [];

        if (!isEmpty(listPermissionCameraGroups)) {
          cameraGroupsPerRows = convertDataRows(listPermissionCameraGroups);
        }

        yield put({
          type: 'save',
          payload: {
            data: cameraGroupsPerRows,
            metadata: { ...resDataPermision?.metadata },
            groupCode: resDataPermision?.payload?.group_code,
          },
        });
      } catch (error) {
        console.error(error);
      }
    },

    // *fetchAllPermission({ payload: { lang } }, { call, put, select }) {
    //   try {
    //     const res = yield call(UserApi.getAllPermission, lang);

    //     const permissionRemoveMonitoring = res?.payload?.filter((r) => r.code !== 'monitoring');

    //     const finalPermission = permissionRemoveMonitoring.map((p) => {
    //       return {
    //         code: p?.code,
    //         name: p?.name,
    //         children: p?.permissions.map((p) => {
    //           return {
    //             code: p?.code,
    //             name: p?.name,
    //           };
    //         }),
    //       };
    //     });

    //     yield put({
    //       type: 'saveAllPermission',
    //       payload: {
    //         data: finalPermission,
    //       },
    //     });
    //   } catch (error) {
    //     console.error(error);
    //   }
    // },

    // *remove({ payload: dataRemove }, { call, put }) {
    //   try {
    //     const res = yield call(UserApi.removePermissionInGroup, dataRemove);
    //     yield put({ type: 'reload' });
    //   } catch (error) {}
    // },
    // // ================================================================
    // //set quyen le cho camera
    *removePermisionCameraGroups({ payload: dataRM }, { call, put }) {
      try {
        const res = yield call(UserApi.removePermisionCameraGroups, dataRM);
        yield put({ type: 'reloadFetchAllPermissionCameraGroups' });
      } catch (error) {}
    },

    *setPermisionCameraGroups({ payload: payloadAdd }, { call, put }) {
      try {
        const res = yield call(UserApi.setPermisionCameraGroups, payloadAdd);
        yield put({ type: 'reloadFetchAllPermissionCameraGroups' });
      } catch (error) {}
    },
    // ==================================================================

    // *reload(action, { put, select }) {
    //   const code = yield select((state) => state.premissionInGroup.groupCode);

    //   yield put({ type: 'fetchAllPermissionInGroup', payload: { code } });
    // },

    *reloadFetchAllPermissionCameraGroups(action, { put, select }) {
      const code = yield select((state) => state.groupCameraPermissionInGroupUser.groupCode);
      yield put({ type: 'fetchAllPermissionCameraGroups', payload: { code } });
    },
  },
};
