import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {getAllJobType, getJobTypeById} from "./effects";
import {JobTypeItemResponse} from "./models";
import {PaginationModel} from "../../models";


export interface JobTypeStateInteface {
  loadingScreen: boolean,
  isSuccess: boolean,
  JobTypeList: {data: JobTypeItemResponse[], isLoading: boolean, pagination: PaginationModel },
  JobTypeById: {data: JobTypeItemResponse}
}

const initState: JobTypeStateInteface = {
  loadingScreen: false,
  isSuccess: false,
  JobTypeList: {
    data: [],
    isLoading: false,
    pagination: {} as PaginationModel,
  },
  JobTypeById: {
    data: {} as JobTypeItemResponse,
  },

};
const jobTypeSlice = createSlice({
  name: 'jobType',
  initialState: initState,
    reducers: {

    },
  extraReducers: builder => {
    builder
      .addCase(getAllJobType.fulfilled, (state, action) => {
        state.JobTypeList.isLoading = false;
        state.JobTypeList.data = action.payload.data || [];
        state.JobTypeList.pagination = {
          pageNumber: action.payload.pageNumber + 1,
          pageSize: action.payload.pageSize,
          total: action.payload.total,
          totalPage: action.payload.totalPage,
        };
      })
      .addCase(getAllJobType.pending, (state, action) => {
        state.JobTypeList.isLoading = true;
      })
      .addCase(getAllJobType.rejected, (state, action) => {
        state.JobTypeList.isLoading = false;
    });

    builder
      .addCase(getJobTypeById.fulfilled, (state, action) => {
        state.loadingScreen = false;
        state.JobTypeById.data = action.payload || {};
      })
      .addCase(getJobTypeById.pending, (state, action) => {
        state.loadingScreen = true;
      })
      .addCase(getJobTypeById.rejected, (state, action) => {
        state.loadingScreen = false;
      });

  },
});
export const {} = jobTypeSlice.actions;
export default jobTypeSlice.reducer;
