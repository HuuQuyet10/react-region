import { createSelector } from '@reduxjs/toolkit';
import {RootState} from '../../app.store';
import {JobTypeItemResponse} from "../models";
import {UserDetailResponse} from "../../user/models";
import {RoleConst} from "../../../constants";

const JobTypeState = (state: RootState) => state.jobType;
export const getJobTypeListSelector = createSelector(JobTypeState, state => state.JobTypeList || {});

export const getJobTypeByIdSelector = createSelector(JobTypeState, state => state.JobTypeById || {});

export const getJobTypeListOption = createSelector(JobTypeState, state => {

  const allJobTypeRaw: JobTypeItemResponse[] = state.JobTypeList.data;
  const jobTypeOption = allJobTypeRaw.map((item: JobTypeItemResponse) => {
    return {label: `${item.code} - ${item.name}`, value: item.id}
  });

  return jobTypeOption || []
});

export const getJobListObjSelector = createSelector(JobTypeState, state => {

  const jobTypeList: JobTypeItemResponse[] = state.JobTypeList.data;

  const jobTypeListObj = jobTypeList?.reduce((acc, crr) => {
    return {...acc, [`${crr.id}`]: {...crr}}
  }, {});

  return jobTypeListObj
});
