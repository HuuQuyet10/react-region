import { createSelector } from '@reduxjs/toolkit';
import {RootState} from '../../app.store';

const JobState = (state: RootState) => state.job;
export const getJobListSelector = createSelector(JobState, state => state.jobList || {});
export const getDetailJobByIdSelector = createSelector(JobState, state => state.detailJobById.data || {});

