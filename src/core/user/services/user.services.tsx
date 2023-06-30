import { createAsyncThunk } from '@reduxjs/toolkit';
import {apiInstance} from "../../../services/api";
import ApiConstants from "../../../constants/endpoint";
import util, {format} from "util";
import {BroadcastResponseItem, CreateUserModel, GetWorkerRequest, paramsGetUserList, UpdateUserModel} from "../models";

// services
export const getUserListAPI = async (params: paramsGetUserList) => {

  const valParams = {
    page: params.pageNumber || 1,
    size: params.pageSize || 10000,
    roleId: params.roleId || null,
    status: params.status || null,
  }
  // const result = await apiInstance.get(ApiConstants.GET_USER_LIST, {params: valParams});
  const result = await apiInstance.get(ApiConstants.GET_USER_LIST, {params: valParams});
  return result;
};

export const getQcListAPI = async (params: GetWorkerRequest) => {

  const valParams = {
    page: params.page || 1,
    size: params.size || 10000,
    roleType: params.roleType || 'QC',
  };
  // const result = await apiInstance.get(ApiConstants.GET_USER_LIST, {params: valParams});
  const result = await apiInstance.get(ApiConstants.GET_LIST_STAFF_QC, {params: valParams});
  return result;
};

export const getStaffListAPI = async (params: GetWorkerRequest) => {
  const valParams = {
    page: params.page || 1,
    size: params.size || 10000,
    roleType: params.roleType || 'STAFF',
  };
  // const result = await apiInstance.get(ApiConstants.GET_USER_LIST, {params: valParams});
  const result = await apiInstance.get(ApiConstants.GET_LIST_STAFF_QC, {params: valParams});
  return result;
};

export const getCustomerListAPI = async (params: {page?: number, size?: number}) => {
  const valParams = {
    page: params.page || 1,
    size: params.size || 10000,
  };
  // const result = await apiInstance.get(ApiConstants.GET_USER_LIST, {params: valParams});
  const result = await apiInstance.get(ApiConstants.GET_LIST_CUSTOMER, {params: valParams});
  return result;
};

export const getUserByIdAPI = async (id) => {
  const url = format(ApiConstants.GET_USER_BY_ID, id);
  const result = await apiInstance.get(url);

  return result;
};


export const updateUserAPI = async (params: UpdateUserModel) => {
  const url = util.format(ApiConstants.UPDATE_AN_USER, params.id);
  const result = await apiInstance.put(url, {...params, language: 'vi'});

  return result;
};


export const toggleActiveUserAPI = async (userId: number) => {
  const url = util.format(ApiConstants.TOGGLE_ACTIVE_USER, userId);
  const result = await apiInstance.post(url);

  return result;
};


export const deleteUserAPI = async (id) => {
  const url = util.format(ApiConstants.DELETE_AN_USER, id);
  const result = await apiInstance.delete(url);

  return result;
};



export const createUserAPI = async (params: CreateUserModel) => {
  // const url = util.format(ApiConstants.CREATE_AN_USER, params.id);
  const paramss = {...params, language: 'en'}
  const result = await apiInstance.post(ApiConstants.CREATE_AN_USER, paramss);

  return result;
};


export const createBroadcastsAPI = async (params: {content: string}) => {
  // const url = util.format(ApiConstants.CREATE_AN_USER, params.id);
  const result = await apiInstance.post(ApiConstants.CREATE_BROADCASTS, params.content, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
  return result;
};


export const getBroadcastsAPI = async () => {
  const result = await apiInstance.get(ApiConstants.GET_BROADCASTS);
  return result;
};


export const deleteBroadcastsAPI = async (params: BroadcastResponseItem) => {
  const url = util.format(ApiConstants.DELETE_BROADCASTS, params.id);
  const result = await apiInstance.delete(url);
  return result;
};


export const updateBroadcastsAPI = async (params: BroadcastResponseItem) => {
  const url = util.format(ApiConstants.UPDATE_BROADCASTS, params.id);
  const result = await apiInstance.patch(url, params);
  return result;
};




