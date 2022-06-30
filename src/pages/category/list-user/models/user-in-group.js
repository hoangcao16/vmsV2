import { notify } from '@/components/Notify';
import { STORAGE } from '@/constants/common';
import UserApi from '@/services/user/UserApi';

export default {
  namespace: 'userInGroup',
  state: {
    list: [],
    metadata: {},
    groupCode: null,
    listUserNoIntoGroup: [],
  },
  reducers: {
    save(state, { payload: { data: list, metadata, groupCode } }) {
      return { ...state, list, metadata, groupCode };
    },
    saveListUserNoGroup(state, { payload: { data: listUserNoIntoGroup } }) {
      return { ...state, listUserNoIntoGroup };
    },
  },
  effects: {
    *fetchAllUserInGroup({ payload: { code } }, { call, put }) {
      try {
        const res = yield call(UserApi.getAllUserInGroupById, code);

        yield put({
          type: 'save',
          payload: {
            data: res?.payload?.users,
            metadata: { ...res?.metadata },
            groupCode:
              res?.payload?.group_code || localStorage.getItem(STORAGE.GROUP_CODE_SELECTED),
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    *fetchAllUserNotInGroup({ payload }, { call, put, select }) {
      try {
        const res = yield call(UserApi.getAllUser, payload);

        const userInGroup = yield call(
          UserApi.getAllUserInGroupById,
          localStorage.getItem(STORAGE.GROUP_CODE_SELECTED),
        );

        const listData = res.payload;
        const listData2 = userInGroup?.payload?.users;

        for (var i = listData.length - 1; i >= 0; i--) {
          for (var j = 0; j < listData2.length; j++) {
            if (listData[i] && listData[i].uuid === listData2[j].uuid) {
              listData.splice(i, 1);
            }
          }
        }

        yield put({
          type: 'saveListUserNoGroup',
          payload: {
            data: listData,
          },
        });
      } catch (error) {
        console.error(error);
      }
    },

    *addMemberIntoGroups({ payload: dataAdd }, { call, put }) {
      try {
        yield call(UserApi.addMemberIntoGroups, dataAdd);

        notify(
          'success',
          'pages.setting-user.list-user.titleSuccess',
          'pages.setting-user.list-user.addMemberIntoGroupSuccess',
        );

        yield put({ type: 'reload' });
        yield put({ type: 'reloadFetchAllUserNotInGroup' });
      } catch (error) {
        console.error(error);
      }
    },

    *remove({ payload: dataRemove }, { call, put }) {
      try {
        yield call(UserApi.removeUserInGroup, dataRemove);

        notify(
          'success',
          'pages.setting-user.list-user.titleSuccess',
          'pages.setting-user.list-user.removeMemberIntoGroupSuccess',
        );

        yield put({ type: 'reload' });
        yield put({ type: 'reloadFetchAllUserNotInGroup' });
      } catch (error) {
        console.log(error);
      }
    },

    *reload(action, { put, select }) {
      const code = yield select(
        (state) => state.userInGroup.groupCode || localStorage.getItem(STORAGE.GROUP_CODE_SELECTED),
      );

      yield put({ type: 'fetchAllUserInGroup', payload: { code } });
    },

    *reloadFetchAllUserNotInGroup(action, { put, select }) {
      yield put({ type: 'fetchAllUserNotInGroup', payload: { page: 1, size: 100000 } });
    },
  },
};
