import { notify } from '@/components/Notify';
import { STORAGE } from '@/constants/common';
import UserApi from '@/services/user/UserApi';

function compare(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}

export default {
  namespace: 'userSettingData',
  state: {
    listAllRole: [],
    listAllUserGroup: [],
    rolesOfUser: [],
    groupsOfUser: [],
    userUuid: null,
  },
  reducers: {
    save(
      state,
      { payload: { listAllRole, listAllUserGroup, rolesOfUser, groupsOfUser, userUuid } },
    ) {
      return { ...state, listAllRole, listAllUserGroup, rolesOfUser, groupsOfUser, userUuid };
    },
    changeRolesOfUser(state, { payload: { rolesOfUser } }) {
      return { ...state, rolesOfUser };
    },
    changeGroupsOfUser(state, { payload: { groupsOfUser } }) {
      return { ...state, groupsOfUser };
    },
  },
  effects: {
    *fetchAllData({ payload: { uuid } }, { call, put, all }) {
      try {
        const [dataListAllRole, dataListAllUserGroup, dataRolesOfUser, dataGroupsOfUser] =
          yield all([
            call(UserApi.getAllRoles, { page: 0, size: 10000 }),
            call(UserApi.getAllGroups, { page: 0, size: 10000 }),
            call(UserApi.getRolesByUser, uuid),
            call(UserApi.getGroupsByUser, uuid),
          ]);

        yield put({
          type: 'save',
          payload: {
            listAllRole: dataListAllRole?.payload?.sort(compare),
            listAllUserGroup: dataListAllUserGroup?.payload?.sort(compare),
            rolesOfUser: dataRolesOfUser?.payload?.roles,
            groupsOfUser: dataGroupsOfUser?.payload?.groups,
            roleCode: localStorage.getItem(STORAGE.USER_UUID_SELECTED) || uuid,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },

    *setGroupForUser({ payload: data }, { call, put, all }) {
      try {
        yield call(UserApi.setGroupForUser, data);

        notify('success', 'noti.success', 'noti.list-user.updateUserSuccess');

        yield put({ type: 'reloadDataGroupOfUser' });
      } catch (error) {
        console.error(error);
        notify('error', 'noti.faid', 'noti.list-user.updateUserFailed');
      }
    },

    *reloadDataGroupOfUser(action, { put, select, call }) {
      const uuid = yield select(
        (state) =>
          state.userSettingData.userUuid || localStorage.getItem(STORAGE.USER_UUID_SELECTED),
      );
      const res = yield call(UserApi.getGroupsByUser, uuid);
      yield put({
        type: 'changeGroupsOfUser',
        payload: {
          groupsOfUser: res?.payload?.groups,
        },
      });

      yield put({
        type: 'groupCameraPermissionInUser/reloadFetchAllPermissionCameraGroups',
        payload: {},
      });
    },

    *setRoleForUser({ payload: data }, { call, put, all }) {
      try {
        yield call(UserApi.setRoleForUser, data);

        notify('success', 'noti.success', 'noti.list-user.updateUserSuccess');

        yield put({ type: 'reloadDataRoleOfUser' });
      } catch (error) {
        console.error(error);
        notify('error', 'noti.faid', 'noti.list-user.updateUserFailed');
      }
    },

    *reloadDataRoleOfUser(action, { put, select, call }) {
      const uuid = yield select(
        (state) =>
          state.userSettingData.userUuid || localStorage.getItem(STORAGE.USER_UUID_SELECTED),
      );
      const res = yield call(UserApi.getRolesByUser, uuid);
      yield put({
        type: 'changeRolesOfUser',
        payload: {
          rolesOfUser: res?.payload?.roles,
        },
      });

      yield put({
        type: 'groupCameraPermissionInUser/reloadFetchAllPermissionCameraGroups',
        payload: {},
      });
    },
  },
};
