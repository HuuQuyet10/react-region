import {GenericObject} from "../../../@types/common";



export interface CreateUserModel {
  birthDay?: string;
  email?: string;
  fullName?: string;
  jobTypes?: number[];
  phone?: string;
  roles?: number[];
  status?: string;
  userName: string;
  password?: string;
  lang?: string
};

export interface UpdateUserModel extends CreateUserModel{
  id: number | string;
  // password? : string
};


export interface paramsGetUserList {
  pageSize?: number
  pageNumber?: number
  roleId?: number
  status?: string
};

export interface UserDetailResponse {
  id: number,
  birthDay: string,
  email: string,
  fullName: string,
  jobTypes: number[],
  language: string,
  phone: string,
  roles: number[],
  status: string,
  userName: string,
  token?: any,
}


export interface GetWorkerRequest {
  page?: number
  size?: number
  roleType?: string
}


export interface BroadcastResponseItem {
  id: string,
  content: string,
  show: boolean,
}








