import {GenericObject} from "../../../@types/common";
import {ReactNode} from "react";



export interface CreateJobModel {
  attachment: string;
  deadline?: string;
  description: string;
  name: string;
};


export interface GetListJobModel {
  pageNumber: number;
  pageSize: number;
  sort?: string;
  type?: number;
  customer?: number;
  qc?: number;
  staff?: number;
  startDate?: string;
  endDate?: string;
  name?: string;
  status?: string;
  sorts?: any;
};


export interface QuantityJobType {
  jobTypeId: number,
  quantity: number,
}

export interface GetDetailJobResponse {
  id: number | any,
  attachment: string,
  deadline: string | any, //
  completionTimeDiff: number, //
  description: string | any, //

  name: string,
  qc: number,
  qcName: string,
  staff: number,
  staffName: string,
  status: string,
  // type: number,
  // outputQuantity: number,
  items: QuantityJobType[]
  createdAt: string,
  completedAt: string,
  customerId: number, //
  customerName: string,  //
  createdUserId: number, //
  createdUserName: string, //
}

export interface UpdateJobRequest extends GetDetailJobResponse{

}

export interface UpdateJobAssignUser{
    jobId: number | string,
    userId: number
}
