import { STORAGE } from '@/constants/common';
import { isEmpty } from 'lodash';

export default function permissionCheck(permission_name) {
  const permissionUser = JSON.parse(localStorage.getItem(STORAGE.USER_PERMISSIONS));

  if (!isEmpty(permissionUser?.roles)) {
    const checkSuperAdmin = permissionUser?.roles.filter((r) => r.role_code === 'superadmin');

    if (checkSuperAdmin.length > 0) return true;
  }

  if (isEmpty(permissionUser?.p_others)) return false;

  return permissionUser?.p_others.includes(permission_name);
}

export const Permission = ({ permissionName, children }) => {
  if (permissionCheck(permissionName)) return children;
  return null;
};

export const PermissionCamera = ({ permissionName, cameraUuid }) => {
  const permissionUser = localStorage.getItem('user_permissions');
  if (!isEmpty(permissionUser?.roles)) {
    const checkSuperAdmin = permissionUser?.roles.filter((r) => r.role_code === 'superadmin');

    if (checkSuperAdmin.length > 0) return children;
  }

  if (isEmpty(permissionUser?.p_cameras)) return null;
  const checkPermission = permissionUser?.p_cameras.filter((r) => r.cam_uuid === cameraUuid);

  let checkPermissionFinal = false;
  if (checkPermission) {
    checkPermissionFinal = checkPermission[0]?.permissions.includes(permissionName);
  }

  if (checkPermissionFinal) return children;
};
