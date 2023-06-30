import { createSelector } from '@reduxjs/toolkit';
import {RootState} from '../../app.store';
import {RoleItemResponse} from "../models";

const RoleState = (state: RootState) => state.role;
export const getRoleListSelector = createSelector(RoleState, state => state.roleList || {});
export const getPermissionsListSelector = createSelector(RoleState, state => state.permissionsList || {});
// export const getJobTypeByIdSelector = createSelector(RoleState, state => state.JobTypeById || {});

export const getRoleListOption = createSelector(RoleState, state => {

  const list = state.roleList?.data.map((item: RoleItemResponse) => {
    return {
      label: item.name,
      value: item.id
    }
  })

  return list;

});

