import request from '@/utils/request';

const UserApi = {
  // User
  getAllUser: async (params) => {
    return request.get(`/authz/api/v0/users`, {
      params,
    });
  },
  createUser: async (values) => {
    return request.post('/authz/api/v0/users', values);
  },

  updateUser: async (id, values) => {
    return request.put(`/authz/api/v0/users/${id}`, values);
  },

  deleteUser: async (uuid) => {
    return request.delete(`/authz/api/v0/users/${uuid}`);
  },

  // UserGroup
  getAllUserGroup: async (params) => {
    return request.get(`/authz/api/v0/groups`, { params });
  },
  createUserGroup: async (params) => {
    return request.post(`/authz/api/v0/groups`, params);
  },
  updateUserGroup: async (id, values) => {
    return request.put(`/authz/api/v0/groups/${id}`, values);
  },

  deleteUserGroup: async (uuid) => {
    return request.delete(`/authz/api/v0/groups/${uuid}`);
  },

  //UserGroupById
  getUserGroupById: async (uuid) => {
    return request.get(`/authz/api/v0/groups/${uuid}`);
  },

  //get all user in group user by group code

  getAllUserInGroupById: async (code, params) => {
    return request.get(`/authz/api/v0/authorization/get_permission?subject=user_g@${code}`, {
      params,
    });
  },

  //remove user in group user
  removeUserInGroup: async (dataRemove) => {
    return request.post('/authz/api/v0/groups/remove', dataRemove);
  },
  //add member user into group user
  addMemberIntoGroups: async (dataAdd) => {
    return request.post('/authz/api/v0/groups/set', dataAdd);
  },

  // UserRole
  getAllUserRole: async (params) => {
    return request.get(`/authz/api/v0/roles`, { params });
  },

  updateUserRole: async (id, values) => {
    return request.put(`/authz/api/v0/roles/${id}`, values);
  },

  createRole: async (params) => {
    return request.post(`/authz/api/v0/roles`, params);
  },
  deleteRole: async (id) => {
    return request.delete(`/authz/api/v0/roles/${id}`);
  },
};

export default UserApi;
