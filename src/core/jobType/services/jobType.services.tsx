import { createAsyncThunk } from '@reduxjs/toolkit';
import {apiInstance} from "../../../services/api";
import ApiConstants from "../../../constants/endpoint";
import util, {format} from "util";
import {CreateJobTypeModel, GetAllJobTypeModel, UpdateJobTypeModel} from "../models";
import qs from 'query-string';
import _ from 'lodash';


export const getAllJobTypetAPI = async (params?: GetAllJobTypeModel) => {

  const values = {
    page: (params && !_.isUndefined(params?.pageNumber) && params.pageNumber) || 1,
    size: params?.pageSize || 10000,
    sort: params?.sort || [],
  };

  const result = await apiInstance.get(ApiConstants.GET_ALL_JOB_TYPE, {
    params: values,
    paramsSerializer: queryParams => {
      const rs = qs.stringify(queryParams, { arrayFormat: 'comma' });
      return rs;
    },
  });

  return result;
};



export const getJobTypeByIdAPI = async (params: {id}) => {
  const url = format(ApiConstants.GET_JOB_TYPE_BY_ID, params.id);
  const result = await apiInstance.get(url);

  return result;
};




// export const updateUserAPI = async (params: UpdateUserModel) => {
//   const url = util.format(ApiConstants.UPDATE_AN_USER, params.id);
//   const result = await apiInstance.patch(url, params);
//
//   return result;
// };



export const createJobTypeAPI = async (params: CreateJobTypeModel) => {
  const result = await apiInstance.post(ApiConstants.CREATE_JOB_TYPE, params);

  return result;
};

export const updateJobTypeAPI = async (params: UpdateJobTypeModel) => {

  const url = format(ApiConstants.UPDATE_JOB_TYPE, params.id);
  const result = await apiInstance.put(url, params);

  return result;
};


export const deleteJobTypeAPI = async (id) => {

  const url = format(ApiConstants.UPDATE_JOB_TYPE, id);
  const result = await apiInstance.delete(url);

  return result;
};

