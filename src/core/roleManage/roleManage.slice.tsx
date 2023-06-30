import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {getAllPermissions, getAllRole} from "./effects";
import {RoleItemResponse} from './models';


interface RoleStateInteface {
  loadingScreen: boolean,
  isSuccess: boolean,
  roleList: {data: RoleItemResponse[], isLoading: boolean},
  permissionsList: {data: any[], isLoading: boolean},
  roleById: {data: any}
}

const initState: RoleStateInteface = {
  loadingScreen: false,
  isSuccess: false,
  roleList: {
    data: [],
    isLoading: false,
  },
  permissionsList: {
    data: [],
    isLoading: false,
  },
  roleById: {data: {},},

};
const roleSlice = createSlice({
  name: 'role',
  initialState: initState,
    reducers: {

    },
  extraReducers: builder => {
    builder
      .addCase(getAllRole.fulfilled, (state, action) => {
        state.roleList.isLoading = false;
        state.roleList.data = action.payload.data || [];
      })
      .addCase(getAllRole.pending, (state, action) => {
        state.roleList.isLoading = true;
      })
      .addCase(getAllRole.rejected, (state, action) => {
        state.roleList.isLoading = false;
    });

    builder
      .addCase(getAllPermissions.fulfilled, (state, action) => {
        state.permissionsList.isLoading = false;
        state.permissionsList.data = action.payload || [];
      })
      .addCase(getAllPermissions.pending, (state, action) => {
        state.permissionsList.isLoading = true;
      })
      .addCase(getAllPermissions.rejected, (state, action) => {
        state.permissionsList.isLoading = false;
    });

    // builder
    //   .addCase(getJobTypeById.fulfilled, (state, action) => {
    //     state.loadingScreen = false;
    //     state.JobTypeById.data = action.payload || {};
    //   })
    //   .addCase(getJobTypeById.pending, (state, action) => {
    //     state.loadingScreen = true;
    //   })
    //   .addCase(getJobTypeById.rejected, (state, action) => {
    //     state.loadingScreen = false;
    //   });

  },
});
export const {} = roleSlice.actions;
export default roleSlice.reducer;
