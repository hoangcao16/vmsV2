import MyService from '../RestApiClient';
import { useIntl } from 'umi';

const UserApi = {
  // User
  getAllUser: async (params) => {
    try {
      const { data } = await MyService.getRequest(`/authz/api/v0/users`, params);
      return data;
    } catch (error) {
      console.log(error);
      return {};
    }
  },
  createUser: async (values) => {
    try {
      const { payload } = await MyService.postRequest('/authz/api/v0/users', values);
      return payload;
    } catch (error) {
      console.log(error);
      return {};
    }
  },

  updateUser: async (id, values) => {
    try {
      await MyService.putRequest(`/authz/api/v0/users/${id}`, values);
    } catch (error) {
      console.log(error);
    }
  },

  deleteUser: async (uuid) => {
    try {
      await MyService.deleteRequest(`/authz/api/v0/users/${uuid}`);
    } catch (error) {
      console.log(error);
    }
  },

  // UserGroup
  getAllUserGroup: async (params) => {
    try {
      const { data } = await MyService.getRequest(`/authz/api/v0/groups`, params);
      return data;
    } catch (error) {
      console.log(error);
      return {};
    }
  },
  createUserGroup: async (params) => {
    try {
      await MyService.postRequest(`/authz/api/v0/groups`, params);
    } catch (error) {
      console.log(error);
      return {};
    }
  },
  updateUserGroup: async (id, values) => {
    try {
      await MyService.putRequest(`/authz/api/v0/groups/${id}`, values);
    } catch (error) {
      console.log(error);
      return {};
    }
  },
  // UserRole
  getAllUserRole: async (params) => {
    try {
      const { data } = await MyService.getRequest(`/authz/api/v0/roles`, params);
      return data;
    } catch (error) {
      console.log(error);
      return {};
    }
  },
  createRole: async (params) => {
    try {
      await MyService.postRequest(`/authz/api/v0/roles`, params);
    } catch (error) {
      console.log(error);
      return {};
    }
  },
};

export default UserApi;
