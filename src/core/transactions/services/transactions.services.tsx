import { createAsyncThunk } from '@reduxjs/toolkit';
import {apiInstance} from "../../../services/api";
import ApiConstants from "../../../constants/endpoint";
import qs from 'query-string';


export const getTransactionAPI = async (GetTransactionRequest) => {

  const result = await apiInstance.get(ApiConstants.GET_TRANSACTIONS, {
    params: GetTransactionRequest,
    paramsSerializer: queryParams => {

      // queryString.stringify({foo: [1, 2, 3], arrayFormat: 'none'}); //=> 'foo=1&foo=2&foo=3'
      // queryString.stringify({foo: [1, 2, 3]}, {arrayFormat: 'comma'}); //=> 'foo=1,2,3'

      const rs = qs.stringify(queryParams);
      return rs;
    },
  });

  return result;
};




