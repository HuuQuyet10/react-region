import { createAsyncThunk } from '@reduxjs/toolkit';
import {apiInstance} from "../../../services/api";
import ApiConstants from "../../../constants/endpoint";

// services
export const loginAPI = async ({ username, password }) => {
  const url = ApiConstants.LOGIN;
  const result = await apiInstance.post(url, {
    username: username,
    password: password,
    rememberMe: true,
  });
  return result;
};

export const getListPermissionCurUserAPI = async () => {
  const url = ApiConstants.GET_LIST_PERMISSIONS;
  const result = await apiInstance.get(url);
  return result;
};


// services
export const changePasswordAPI = async ({ currentPassword, newPassword }) => {
  const url = ApiConstants.USER_LOGIN_CHANGE_PASSWORD;
  const result = await apiInstance.post(url, {currentPassword, newPassword});
  return result;
};



