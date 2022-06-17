import request from '@/utils/request';

const ResetPassword = {
  resetPassword: async (record) => {
    return request.request({
      method: 'POST',
      url: '/authz/reset_password',
      data: record,
    });
  },
};

export default ResetPassword;
