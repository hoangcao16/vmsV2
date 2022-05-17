import request from '@/utils/request';

const UserApi = {
  // User
  getAllUser: async (params) => {
    return request.get(`/authz/api/v0/users`, params);
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
    return request.get(`/authz/api/v0/groups`, params);
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
  // UserRole
  getAllUserRole: async (params) => {
    return request.get(`/authz/api/v0/roles`, params);
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
