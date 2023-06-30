import { createAsyncThunk } from '@reduxjs/toolkit';
import PriceServices from '../services';
import {UpdatePriceRequest} from "../models";


export const updatePriceByCustomer = createAsyncThunk(
  'price/updatePrice',
  async (params: UpdatePriceRequest, {rejectWithValue})  => {
    try {
      const result = await PriceServices.updatePriceByCustomerAPI(params);
      return result.data;
    } catch (error: any) {
      return rejectWithValue({ ...error.response.data});
    }
});

export const getDetailPriceByCustomer = createAsyncThunk(
  'price/getPrice',
  async (customerId: number, {dispatch, rejectWithValue})  => {
    try {
      const result = await PriceServices.getDetailPriceByCustomerAPI(customerId);
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  });


