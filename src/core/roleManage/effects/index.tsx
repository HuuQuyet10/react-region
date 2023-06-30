import { createAsyncThunk } from '@reduxjs/toolkit';
import RoleServices from '../services';
import {CreateRole, GetAllRoleModel} from "../models";


export const getAllRole = createAsyncThunk(
  'role/getAllRole',
  async (params?: GetAllRoleModel)  => {
    // try {
      const result = await RoleServices.getAllRoleAPI(params);
      return result.data;
    // } catch (error: any) {
    //   return rejectWithValue(error.response.data);
    // }
});


export const getAllPermissions = createAsyncThunk(
  'role/getAllPermissions',
  async (params?: { [key: string]: any })  => {
      const result = await RoleServices.getAllPermissionsAPI();
      return result.data;
});


// export const getJobTypeById = createAsyncThunk(
//   'jobType/getJobTypeById',
//   async (params: {id}, {dispatch, rejectWithValue})  => {
//   try {
//     const result = await JobTypeServices.getJobTypeByIdAPI(params);
//     return result.data;
//   } catch (error: any) {
//     return rejectWithValue(error.response.data);
//   }
// });




export const createRole = createAsyncThunk('role/createRole', async (params: any, {rejectWithValue}) => {
  try {
    const result = await RoleServices.createRoleAPI(params);
    return result.data;
  } catch (error: any) {
    return rejectWithValue({ ...error.response.data});
  }
});

export const updateRole = createAsyncThunk('role/updateRole', async (params: any, {rejectWithValue}) => {
  try {
    const result = await RoleServices.updateRoleAPI(params);
    return result.data;
  } catch (error: any) {
    return rejectWithValue({ ...error.response.data});
  }
});

export const deleteRole = createAsyncThunk('role/deleteRole', async (id: any, {rejectWithValue}) => {
  try {
    const result = await RoleServices.deleteRoleAPI(id);
    return result.data;
  } catch (error: any) {
    return rejectWithValue({ ...error.response.data});
  }
});

