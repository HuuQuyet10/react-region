import {OptionModel} from "../../models";

export const JobStatusValue = {
  CREATED: 'CREATED',
  CONFIRMED: 'CONFIRMED',
  DOING: 'DOING',
  REVIEWING: 'REVIEWING',
  WAITING_REVIEW: 'WAITING_REVIEW',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  COMPLETED_LATE: 'COMPLETED_LATE',
};


export const JobStatusOptions: OptionModel[] = [
  {
    value: JobStatusValue.CREATED,
    label: 'Create',
    color: '#9f9d0b',
    disableValue: [JobStatusValue.CREATED, JobStatusValue.CONFIRMED, JobStatusValue.REVIEWING, JobStatusValue.WAITING_REVIEW, JobStatusValue.COMPLETED, JobStatusValue.COMPLETED_LATE]
  },
  // {
  //   value: JobStatusValue.CONFIRMED,
  //   label: 'Confirm', color: '#025b9a',
  //   // disableValue: [JobStatusValue.CREATED, JobStatusValue.CONFIRMED, JobStatusValue.DOING, JobStatusValue.REVIEWING, JobStatusValue.WAITING_REVIEW, JobStatusValue.COMPLETED, JobStatusValue.COMPLETED_LATE]
  // },
  {
    value: JobStatusValue.DOING,
    label: 'Doing',
    color: '#1bb401',
    disableValue: [JobStatusValue.CREATED, JobStatusValue.CONFIRMED, JobStatusValue.DOING, JobStatusValue.REVIEWING, JobStatusValue.COMPLETED, JobStatusValue.COMPLETED_LATE]
  },
  {
    value: JobStatusValue.WAITING_REVIEW,
    label: 'Waiting Review',
    color: '#10c2f7',
    disableValue: [JobStatusValue.CREATED, JobStatusValue.CONFIRMED, JobStatusValue.DOING, JobStatusValue.WAITING_REVIEW, JobStatusValue.COMPLETED, JobStatusValue.COMPLETED_LATE]
  },
  {
    value: JobStatusValue.REVIEWING,
    label: 'Reviewing',
    color: '#ff9930',
    disableValue: [JobStatusValue.CREATED, JobStatusValue.CONFIRMED, JobStatusValue.REVIEWING, JobStatusValue.WAITING_REVIEW, JobStatusValue.COMPLETED_LATE, JobStatusValue.CANCELLED]
  },
  {
    value: JobStatusValue.COMPLETED,
    label: 'Completed',
    color: '#d21fff',
    disableValue: [JobStatusValue.CREATED, JobStatusValue.DOING, JobStatusValue.REVIEWING, JobStatusValue.WAITING_REVIEW, JobStatusValue.COMPLETED, JobStatusValue.COMPLETED_LATE, JobStatusValue.CANCELLED]
  },
  {
    value: JobStatusValue.CANCELLED,
    label: 'Cancelled',
    color: '#333'
  },
  {
    value: JobStatusValue.COMPLETED_LATE,
    label: 'Complete Late',
    color: 'red',
    disableValue: [JobStatusValue.CREATED, JobStatusValue.DOING, JobStatusValue.REVIEWING, JobStatusValue.WAITING_REVIEW, JobStatusValue.COMPLETED, JobStatusValue.COMPLETED_LATE, JobStatusValue.CANCELLED]
  },
];