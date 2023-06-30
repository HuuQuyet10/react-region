import { createAsyncThunk } from '@reduxjs/toolkit';
import {CreateJobModel, GetListJobModel, UpdateJobAssignUser, UpdateJobRequest} from "../models";
import * as JobServices from "../services/job.services";


export const getJobList = createAsyncThunk(
  'job/getJobList',
  async (params: GetListJobModel, {dispatch, rejectWithValue})  => {
  try {
    const result = await  JobServices.getJobListAPI(params);
    return result.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getJobById = createAsyncThunk(
  'job/getJobById',
  async (id: any, {dispatch, rejectWithValue})  => {
  try {
    const result = await  JobServices.getJobByIdAPI(id);
    return result.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});


// export const updateUser = createAsyncThunk('user/updateUser', async (params: UpdateUserModel, {rejectWithValue}) => {
//   try {
//     const result = await UserServices.updateUserAPI(params);
//     return result.data;
//   } catch (error: any) {
//     return rejectWithValue({ ...error.response.data});
//   }
// });

export const deleteJob = createAsyncThunk('job/deleteJob', async (id: string | number, {rejectWithValue}) => {
  try {
    const result = await JobServices.deleteJobAPI(id);
    return result.data;
  } catch (error: any) {
    return rejectWithValue({ ...error.response.data});
  }
});

export const createJob = createAsyncThunk('job/createJob', async (params: CreateJobModel, {rejectWithValue}) => {
  try {
    const result = await JobServices.createJobAPI(params);
    return result.data;
  } catch (error: any) {
    return rejectWithValue({ ...error.response.data});
  }
});

export const updateJobAct = createAsyncThunk('job/updateJob', async (params: UpdateJobRequest, {rejectWithValue}) => {
  try {
    const result = await JobServices.updateJobAPI(params);
    return result.data;
  } catch (error: any) {
    return rejectWithValue({ ...error.response.data});
  }
});

export const updateStatusJobAct = createAsyncThunk('job/updateStatusJob', async (params: {id: number | string, jobStatus: string}, {rejectWithValue}) => {
  try {
    const result = await JobServices.updateStatusJobAPI(params);
    return result.data;
  } catch (error: any) {
    return rejectWithValue({ ...error.response.data});
  }
});

export const updateJobAssignStaffAct = createAsyncThunk('job/updateJobAssignStaff', async (params: UpdateJobAssignUser, {rejectWithValue}) => {
    try {
        const result = await JobServices.updateJobAssignStaffAPI(params);
        return result.data;
    } catch (error: any) {
        return rejectWithValue({ ...error.response.data});
    }
});

export const updateJobAssignQcAct = createAsyncThunk('job/updateJobAssignQC', async (params: UpdateJobAssignUser, {rejectWithValue}) => {
    try {
        const result = await JobServices.updateJobAssignQcAPI(params);
        return result.data;
    } catch (error: any) {
        return rejectWithValue({ ...error.response.data});
    }
});

