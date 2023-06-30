import { createAsyncThunk } from '@reduxjs/toolkit';
import {apiInstance} from "../../../services/api";
import ApiConstants from "../../../constants/endpoint";
import util, {format} from "util";
import {CreateRole, GetAllRoleModel} from "../models";
import qs from 'query-string';



export const getAllRoleAPI = async (params?: GetAllRoleModel) => {

  const values = {
    page: (params && params.pageNumber) || 1,
    size: params?.pageSize || 1000,
    sort: params?.sort || [],
  };

  const result = await apiInstance.get(ApiConstants.GET_ALL_ROLE, {
    params: values,
    paramsSerializer: queryParams => {
      const rs = qs.stringify(queryParams, { arrayFormat: 'comma' });
      return rs;
    },
  });

  return result;
};


export const getAllPermissionsAPI = async () => {

  const result = await apiInstance.get(ApiConstants.GET_ALL_PERMISSIONS);

  return result;
};



// export const getJobTypeByIdAPI = async (params: {id}) => {
//   const url = format(ApiConstants.GET_JOB_TYPE_BY_ID, params.id);
//   const result = await apiInstance.get(url);
//
//   return result;
// };





export const createRoleAPI = async (params: any) => {
  const result = await apiInstance.post(ApiConstants.CREATE_ROLE, params);

  return result;
};

export const updateRoleAPI = async (params: any) => {

  const url = format(ApiConstants.UPDATE_ROLE, params.id);
  const result = await apiInstance.put(url, params);

  return result;
};


export const deleteRoleAPI = async (id) => {

  const url = format(ApiConstants.DELETE_ROLE, id);
  const result = await apiInstance.delete(url);

  return result;
};

