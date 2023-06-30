import { createAsyncThunk } from '@reduxjs/toolkit';
import JobTypeServices from '../services';
import {CreateJobTypeModel, GetAllJobTypeModel, UpdateJobTypeModel} from "../models";


export const getAllJobType = createAsyncThunk('jobType/getAllJobType', async (params?: GetAllJobTypeModel)  => {
      const result = await JobTypeServices.getAllJobTypetAPI(params);
      return result.data;
});


export const getJobTypeById = createAsyncThunk('jobType/getJobTypeById', async (params: {id}, {dispatch, rejectWithValue})  => {
  try {
    const result = await JobTypeServices.getJobTypeByIdAPI(params);
    return result.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});




export const createJobType = createAsyncThunk('jobType/create', async (params: CreateJobTypeModel, {rejectWithValue}) => {
  try {
    const result = await JobTypeServices.createJobTypeAPI(params);
    return result.data;
  } catch (error: any) {
    return rejectWithValue({ ...error.response.data});
  }
});

export const updateJobType = createAsyncThunk('jobType/update', async (params: UpdateJobTypeModel, {rejectWithValue}) => {
  try {
    const result = await JobTypeServices.updateJobTypeAPI(params);
    return result.data;
  } catch (error: any) {
    return rejectWithValue({ ...error.response.data});
  }
});

export const deleteJobType = createAsyncThunk('jobType/delete', async (id: any, {rejectWithValue}) => {
  try {
    const result = await JobTypeServices.deleteJobTypeAPI(id);
    return result.data;
  } catch (error: any) {
    return rejectWithValue({ ...error.response.data});
  }
});

