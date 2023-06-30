import {GenericObject} from "../../../@types/common";



export interface PriceItemByJobType {
  jobTypeId: number | string,
  unitPrice: number
}

export interface UpdatePriceRequest {
  customerId: number | string;
  prices: PriceItemByJobType[];
}


export interface UpdatePriceResponse {
  customerId: number,
  customerName: string,
  prices: PriceItemByJobType[]
}



export interface GetPriceByCustomerResponse {
  customerId: number,
  customerName: string,
  prices: PriceItemByJobType[]
}