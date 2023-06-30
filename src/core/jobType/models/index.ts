import {GenericObject} from "../../../@types/common";

export interface CreateJobTypeModel {
  name: string;
  code: string;
};

export interface UpdateJobTypeModel extends CreateJobTypeModel{
  id: number;
};

export interface GetAllJobTypeModel {
  pageNumber?: number;
  pageSize?: number;
  sort?: string;
};

export interface JobTypeItemResponse {
  code: string
  id: number
  name: string
}

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
}