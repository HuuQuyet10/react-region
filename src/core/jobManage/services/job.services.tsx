import {apiInstance} from "../../../services/api";
import ApiConstants from "../../../constants/endpoint";
import util, {format} from "util";
import {CreateJobModel, GetListJobModel, UpdateJobAssignUser, UpdateJobRequest} from "../models";
import _ from "lodash";
import qs from "query-string";

// services
export const getJobListAPI = async (params: GetListJobModel) => {

  const paramClone = {...params} as Partial<GetListJobModel>;

  delete paramClone.pageSize;
  delete paramClone.pageNumber;

  const values = {
    page: (params && !_.isUndefined(params?.pageNumber) && params.pageNumber) || 1,
    size: params?.pageSize || 20,
    sorts: params?.sorts || [],
    type: params?.type,
    customer: params?.customer,
    name: params?.name,
    status: params?.status,
    qc: params?.qc,
    staff: params?.staff,
    startDate: params?.startDate,
    endDate: params?.endDate,
  };

  const result = await apiInstance.get(ApiConstants.GET_LIST_JOB, {
    params: values,
    paramsSerializer: queryParams => {
      const rs = qs.stringify(queryParams, { arrayFormat: 'comma' });
      return rs;
    },
  });

  return result;
};


export const getJobByIdAPI = async (id) => {
  const url = format(ApiConstants.GET_JOB_BY_ID, id);
  const result = await apiInstance.get(url);

  return result;
};

//
// export const updateUserAPI = async (params: UpdateUserModel) => {
//   const url = util.format(ApiConstants.UPDATE_AN_USER, params.id);
//   const result = await apiInstance.patch(url, params);
//
//   return result;
// };


export const deleteJobAPI = async (id) => {
  const url = util.format(ApiConstants.DELETE_A_JOB, id);
  const result = await apiInstance.delete(url);

  return result;
};



export const createJobAPI = async (params: CreateJobModel) => {
  // const url = util.format(ApiConstants.CREATE_AN_USER, params.id);
  const result = await apiInstance.post(ApiConstants.CREATE_A_NEW_JOB, params);

  return result;
};



export const updateJobAPI = async (params: UpdateJobRequest) => {
  const url = util.format(ApiConstants.UPDATE_JOB, params.id);
  const result = await apiInstance.put(url, params);

  return result;
};


export const updateStatusJobAPI = async (params: {id: number | string, jobStatus: string}) => {
  const url = util.format(ApiConstants.UPDATE_STATUS_JOB, params.id);
  const result = await apiInstance.patch(url, {jobStatus: params.jobStatus});

  return result;
};

export const updateJobAssignStaffAPI = async (params: UpdateJobAssignUser) => {
    const url = util.format(ApiConstants.UPDATE_JOB_STAFF_ASSIGN, params.jobId);
    const result = await apiInstance.patch(url, params);

    return result;
};

export const updateJobAssignQcAPI = async (params: UpdateJobAssignUser) => {
    const url = util.format(ApiConstants.UPDATE_JOB_QC_ASSIGN, params.jobId);
    const result = await apiInstance.patch(url, params);

    return result;
};


