export const API_URL = REACT_APP_BASE_URL || 'http://10.0.0.62:10001';

export const STORAGE = {
  TOKEN: 'token',
  USER: 'user',
  USER_PERMISSIONS: 'user_permissions',
  REFRESH_TOKEN: 'refreshToken',
  GROUP_CODE_SELECTED: 'group_code_selected',
  GROUP_UUID_SELECTED: 'group_uuid_selected',
  ROLE_CODE_SELECTED: 'role_code_selected',
  ROLE_UUID_SELECTED: 'role_uuid_selected',
};
export const PAGE_SIZE = 20;
export const STATUS_CODE = {
  LIST_SUCCESS_CODE: [201, 202, 600, 700, 800, 1100, 1300, 1400, 1700],
  SUCCESS: 700,
  CREATED: 201,
  UPDATED: 202,
};

export const NOTYFY_TYPE = {
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  error: 'error',
};
export const CAMERASTATUS = {
  SUCCESS: 1,
  ERRORS: 0,
};
// export const IS_SERVER = typeof window === 'undefined';
