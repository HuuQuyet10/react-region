import { createSelector } from '@reduxjs/toolkit';
import {RootState} from '../../app.store';

const AppAdmin = (state: RootState) => state.curUserLogin;
export const getLoginUserSelector = createSelector(AppAdmin, state => state.loginUser || {});
export const getListPermissionLoginUser = createSelector(AppAdmin, state => state.listPermisions.data || []);

export const getLoadingLogin = createSelector(AppAdmin, state => {

  return state.isLoading;
});


