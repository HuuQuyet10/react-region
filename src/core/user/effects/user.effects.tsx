import {createAsyncThunk} from '@reduxjs/toolkit';
import UserServices from '../services';
import {BroadcastResponseItem, CreateUserModel, GetWorkerRequest, paramsGetUserList, UpdateUserModel} from "../models";
import * as JobServices from "../../jobManage/services/job.services";
import {CreateJobModel} from "../../jobManage/models";


export const getUserList = createAsyncThunk(
  'user/getUserList',
  async (params: paramsGetUserList, {dispatch, rejectWithValue}) => {
    try {
      const result = await UserServices.getUserListAPI(params);
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  });

export const getQcListAct = createAsyncThunk('user/getQcListAct', async (params: GetWorkerRequest, {dispatch, rejectWithValue}) => {
  try {
    const result = await UserServices.getQcListAPI(params);
    return result.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getStaffListAct = createAsyncThunk('user/getStaffListAct', async (params: GetWorkerRequest, {dispatch, rejectWithValue}) => {
  try {
    const result = await UserServices.getStaffListAPI(params);
    return result.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getCustomerListAct = createAsyncThunk('user/getCustomerList', async (params: {page?: number, size?: number}, {dispatch, rejectWithValue}) => {
  try {
    const result = await UserServices.getCustomerListAPI(params);
    return result.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getUserById = createAsyncThunk(
  'user/getUserById',
  async (id: any, {dispatch, rejectWithValue}) => {
    try {
      const result = await UserServices.getUserByIdAPI(id);
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  });


export const updateUser = createAsyncThunk('user/updateUser', async (params: UpdateUserModel, {rejectWithValue}) => {
  try {
    const result = await UserServices.updateUserAPI(params);
    return result.data;
  } catch (error: any) {
    return rejectWithValue({...error.response.data});
  }
});


export const toggleActiveUser = createAsyncThunk('user/toggleActiveUser', async (userId: number, {rejectWithValue}) => {
  try {
    const result = await UserServices.toggleActiveUserAPI(userId);
    return result.data;
  } catch (error: any) {
    return rejectWithValue({...error.response.data});
  }
});


export const deleteUser = createAsyncThunk('user/deleteUser', async (id: string | number, {rejectWithValue}) => {
  try {
    const result = await UserServices.deleteUserAPI(id);
    return result.data;
  } catch (error: any) {
    return rejectWithValue({...error.response.data});
  }
});

export const createUser = createAsyncThunk('user/createUser', async (params: CreateUserModel, {rejectWithValue}) => {
  try {
    const result = await UserServices.createUserAPI(params);
    return result.data;
  } catch (error: any) {
    return rejectWithValue({...error.response.data});
  }
});




export const createBroadcasts = createAsyncThunk('user/createBroadcasts', async (params: {content: string}, {rejectWithValue}) => {
  try {
    const result = await UserServices.createBroadcastsAPI(params);
    return result.data;
  } catch (error: any) {
    return rejectWithValue({ ...error.response.data});
  }
});

export const getBroadcasts = createAsyncThunk('user/getBroadcasts', async (_, {rejectWithValue}) => {
  try {
    const result = await UserServices.getBroadcastsAPI();
    return result.data;
  } catch (error: any) {
    return rejectWithValue({ ...error.response.data});
  }
});

export const deleteBroadcast = createAsyncThunk('user/deleteBroadcast', async (params: BroadcastResponseItem, {rejectWithValue}) => {
  try {
    const result = await UserServices.deleteBroadcastsAPI(params);
    return result.data;
  } catch (error: any) {
    return rejectWithValue({ ...error.response.data});
  }
});

export const updateBroadcast = createAsyncThunk('user/updateBroadcast', async (params: BroadcastResponseItem, {rejectWithValue}) => {
  try {
    const result = await UserServices.updateBroadcastsAPI(params);
    return result.data;
  } catch (error: any) {
    return rejectWithValue({ ...error.response.data});
  }
});


















