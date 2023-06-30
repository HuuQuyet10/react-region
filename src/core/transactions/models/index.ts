import {GenericObject} from "../../../@types/common";



export interface GetTransactionRequest {
  page: number,
  size: number,
  month: number,
  sorts: string[],
  jobId?: string,
  startDate?: string, // date format: 2023-03-01 00:00:00 - yyyy-MM-dd hh:mm:ss
  endDate?: string, // date format: 2023-03-01 00:00:00 - yyyy-MM-dd hh:mm:ss
  staffs: any[]
}


export interface GetTransactionResponse{
  id: number,
  jobId: number,
  jobName: string,
  jobPrice: number,
  jobTypeId: number,
  createdAt: string,
  description: string,
  staffId: number,
  staffName: string,
  qcId: number,
  qcName: string,
  customerId: number,
  customerName: string,
}