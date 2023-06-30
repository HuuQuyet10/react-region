import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {getJobById, getJobList} from "./effects";
import {GetDetailJobResponse} from "./models";



export interface JobState{
  isLoading: boolean,
  isSuccess: boolean,
  jobList: {data: any[], isLoading: boolean, pagination: any}
  detailJobById: {data: GetDetailJobResponse, isLoading: boolean}
}

const initState: JobState = {
  isLoading: false,
  isSuccess: false,
  jobList: {
    data: [],
    isLoading: false,
    pagination: null,
  },
  detailJobById: {
    data: {} as GetDetailJobResponse,
    isLoading: false,
  },
};
const jobSlice = createSlice({
  name: 'job',
  initialState: initState,
    reducers: {
      clearDataJobDetail: (state) => {
        state.detailJobById = initState.detailJobById;
        return state;
      },
    },
  extraReducers: builder => {
    builder
      .addCase(getJobList.fulfilled, (state, action) => {
        state.jobList.isLoading = false;
        state.jobList.data = action.payload.data || [];
        state.jobList.pagination = {
          pageNumber: action.payload.pageNumber + 1,
          pageSize: action.payload.pageSize,
          total: action.payload.total,
          totalPage: action.payload.totalPage,
        };
      })
      .addCase(getJobList.pending, (state, action) => {
        state.jobList.isLoading = true;
      })
      .addCase(getJobList.rejected, (state, action) => {
        state.jobList.isLoading = false;
      });

    builder
      .addCase(getJobById.fulfilled, (state, action) => {
        state.detailJobById.isLoading = false;
        state.detailJobById.data = action.payload || {};
      })
      .addCase(getJobById.pending, (state, action) => {
        state.detailJobById.isLoading = true;
      })
      .addCase(getJobById.rejected, (state, action) => {
        state.detailJobById.isLoading = false;
      });


  },
});
export const {clearDataJobDetail} = jobSlice.actions;
export default jobSlice.reducer;
