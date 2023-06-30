import { createSelector } from '@reduxjs/toolkit';
import {RootState} from '../../app.store';
import {RoleConst} from "../../../constants";
import {BroadcastResponseItem, UserDetailResponse} from '../models';
import _ from 'lodash';

const AppUser = (state: RootState) => state.user;
export const getUserListSelector = createSelector(AppUser, state => state.userList || {});
export const getUserByIdSelector = createSelector(AppUser, state => state.userById || {});


export const getCustomerListSelector = createSelector(AppUser, state => {

  const userList = state.userList.data;
  const customerList = userList?.filter((item: UserDetailResponse) => item.roles.includes(RoleConst.CUSTOMER));

  return customerList || []
});

export const getAllStaffSelector = createSelector(AppUser, state => {

  const allUser: UserDetailResponse[] = state.userList.data;
  const staffList = allUser.filter(item => item.roles.includes(RoleConst.STAFF));

  return staffList || [];
});

export const getAllQCSelector = createSelector(AppUser, state => {

  const allUser: UserDetailResponse[] = state.userList.data;
  const QCList = allUser.filter(item => item.roles.includes(RoleConst.QCA));

  return QCList || [];
});


export const getBroadcastsMessageSelector = createSelector(AppUser, state => {
  const broadcastList = state.broadcasts.data;
  const lastestItem = !_.isEmpty(broadcastList) ? broadcastList[broadcastList.length - 1] : '';

  return lastestItem;
});


export const selectLoadingGetBroadcasts = createSelector(AppUser, state => {
  return state.broadcasts.isLoading;
});

export const selectAllBroadcasts = createSelector(AppUser, state => {
  return state.broadcasts.data;
});

export const selectAllActiveBroadcasts = createSelector(AppUser, state => {
  const allBroadcasts = state.broadcasts.data;
  const activeBroadcasts = allBroadcasts?.filter((item: BroadcastResponseItem) => item.show)?.map(item2 => item2.content);

  return activeBroadcasts.join('');
});


//=======================
// export const getAllStaffOption = createSelector(AppUser, state => {
//
//   const allUser: UserDetailResponse[] = state.userList.data;
//   const staffList = allUser.filter(item => item.roles.includes(RoleConst.STAFF));
//
//   const staffListOption = staffList.map((item: UserDetailResponse) => {
//     return {label: item.fullName, value: item.id}
//   });
//
//   return staffListOption || [];
// });
//
//
// export const getAllQCOption = createSelector(AppUser, state => {
//
//   const allUser: UserDetailResponse[] = state.userList.data;
//   const QCList = allUser.filter(item => item.roles.includes(RoleConst.QCA));
//   const QCListOption = QCList.map((item: UserDetailResponse) => {
//     return {label: item.fullName, value: item.id}
//   });
//
//   return QCListOption || [];
// });

//=======================

export const getAllCustomerOption = createSelector(AppUser, state => {

  const customerList: UserDetailResponse[] = state.customerList.data;

  const customerListOption = customerList.map((item: UserDetailResponse) => {
    return {label: item.fullName, value: item.id}
  });

  return _.uniqBy(customerListOption, 'value') || [];
});


export const getAllStaffOption = createSelector(AppUser, state => {

  const staffList: UserDetailResponse[] = state.staffList.data;

  const staffListOption = staffList.map((item: UserDetailResponse) => {
    return {label: item.fullName, value: item.id}
  });

  return _.uniqBy(staffListOption, 'value') || [];
});


export const getAllQCOption = createSelector(AppUser, state => {

  const QCList: UserDetailResponse[] = state.qcList.data;
  const QCListOption = QCList.map((item: UserDetailResponse) => {
    return {label: item.fullName, value: item.id}
  });

  return _.uniqBy(QCListOption, 'value') || [];
});