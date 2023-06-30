import { createAsyncThunk } from '@reduxjs/toolkit';
import {apiInstance} from "../../../services/api";
import ApiConstants from "../../../constants/endpoint";
import {UpdatePriceRequest} from "../models";
import qs from 'query-string';



export const updatePriceByCustomerAPI = async (params: UpdatePriceRequest) => {

  const url = ApiConstants.UPDATE_PRICES_BY_CUSTOMER;
  const result = await apiInstance.post(url, params);

  return result;
};


export const getDetailPriceByCustomerAPI = async (customerId: number) => {

  const result = await apiInstance.get(ApiConstants.GET_PRICES_BY_CUSTOMER, {
    params: {customerId},
    paramsSerializer: queryParams => {
      const rs = qs.stringify(queryParams, { arrayFormat: 'comma' });
      return rs;
    },
  });

  return result;
};


// export const deleteRoleAPI = async (id) => {
//
//   const url = format(ApiConstants.DELETE_ROLE, id);
//   const result = await apiInstance.delete(url);
//
//   return result;
// };


