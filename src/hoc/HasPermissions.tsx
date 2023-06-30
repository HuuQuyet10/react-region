import React from 'react'
import {useSelector} from "react-redux";
import {getListPermissionLoginUser} from "../core/admin/selectors";


interface HasPermissionsProps {
  permissions: string[] | string
}

const HasPermissions = (props) => {

  const listpermission = useSelector(getListPermissionLoginUser);

  const {permissions, children} = props;

  const hasPermission = listpermission.some((item: string) => permissions.includes(item));

  if (hasPermission) {
    return <>{children}</>;
  }
  return <></>;
};
export default HasPermissions;
