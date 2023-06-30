import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {getBroadcasts, getCustomerListAct, getQcListAct, getStaffListAct, getUserById, getUserList} from "./effects";
import {BroadcastResponseItem, UserDetailResponse} from "./models";
import {PaginationModel} from "../../models";



export interface UserStateInterface {
  isLoading: boolean,
  isSuccess: boolean,
  userList: {data: UserDetailResponse[], isLoading: boolean, pagination: PaginationModel},
  staffList: {data: UserDetailResponse[], isLoading: boolean, pagination: PaginationModel},
  customerList: {data: UserDetailResponse[], isLoading: boolean, pagination: PaginationModel},
  qcList: {data: UserDetailResponse[], isLoading: boolean, pagination: PaginationModel},
  userById: {data: UserDetailResponse, isLoading: boolean}
  broadcasts: {data: BroadcastResponseItem[], isLoading: boolean}
}

const initState: UserStateInterface = {
  isLoading: false,
  isSuccess: false,
  userList: {data: [], isLoading: false, pagination: {} as PaginationModel,},
  staffList: {data: [], isLoading: false, pagination: {} as PaginationModel,},
  customerList: {data: [], isLoading: false, pagination: {} as PaginationModel,},
  qcList: {data: [], isLoading: false, pagination: {} as PaginationModel,},
  userById: {data: {} as UserDetailResponse, isLoading: false,},
  broadcasts: {data: [], isLoading: false,},
};
const userSlice = createSlice({
  name: 'user',
  initialState: initState,
    reducers: {

    },
  extraReducers: builder => {
    builder
      .addCase(getUserList.fulfilled, (state, action) => {
        state.userList.isLoading = false;
        state.isSuccess = true;
        state.userList.data = action.payload.data || [];
        state.userList.pagination = {
          pageNumber: action.payload.pageNumber + 1,
          pageSize: action.payload.pageSize,
          total: action.payload.total,
          totalPage: action.payload.totalPage,
        };
      })
      .addCase(getUserList.pending, (state, action) => {
        state.userList.isLoading = true;
      })
      .addCase(getUserList.rejected, (state, action) => {
        state.userList.isLoading = false;
      });

    builder
      .addCase(getUserById.fulfilled, (state, action) => {
        state.userById.isLoading = false;
        state.userById.data = action.payload || {};
      })
      .addCase(getUserById.pending, (state, action) => {
        state.userById.isLoading = true;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.userById.isLoading = false;
      });

    builder
      .addCase(getBroadcasts.fulfilled, (state, action) => {
        state.broadcasts.isLoading = false;
        state.broadcasts.data = action.payload || [];
      })
      .addCase(getBroadcasts.pending, (state, action) => {
        state.broadcasts.isLoading = true;
      })
      .addCase(getBroadcasts.rejected, (state, action) => {
        state.broadcasts.isLoading = false;
      });

    builder
      .addCase(getQcListAct.fulfilled, (state, action) => {
        state.qcList.isLoading = false;
        state.qcList.data = action.payload.data || [];
        state.qcList.pagination = {
          pageNumber: action.payload.pageNumber + 1,
          pageSize: action.payload.pageSize,
          total: action.payload.total,
          totalPage: action.payload.totalPage,
        };
      })
      .addCase(getQcListAct.pending, (state, action) => {
        state.qcList.isLoading = true;
      })
      .addCase(getQcListAct.rejected, (state, action) => {
        state.qcList.isLoading = false;
      });

    builder
      .addCase(getStaffListAct.fulfilled, (state, action) => {
        state.staffList.isLoading = false;
        state.staffList.data = action.payload.data || [];
        state.staffList.pagination = {
          pageNumber: action.payload.pageNumber + 1,
          pageSize: action.payload.pageSize,
          total: action.payload.total,
          totalPage: action.payload.totalPage,
        };
      })
      .addCase(getStaffListAct.pending, (state, action) => {
        state.staffList.isLoading = true;
      })
      .addCase(getStaffListAct.rejected, (state, action) => {
        state.staffList.isLoading = false;
      });

    builder
      .addCase(getCustomerListAct.fulfilled, (state, action) => {
        state.customerList.isLoading = false;
        state.customerList.data = action.payload.data || [];
        state.customerList.pagination = {
          pageNumber: action.payload.pageNumber + 1,
          pageSize: action.payload.pageSize,
          total: action.payload.total,
          totalPage: action.payload.totalPage,
        };
      })
      .addCase(getCustomerListAct.pending, (state, action) => {
        state.customerList.isLoading = true;
      })
      .addCase(getCustomerListAct.rejected, (state, action) => {
        state.customerList.isLoading = false;
      });

  },
});
export const {} = userSlice.actions;
export default userSlice.reducer;
