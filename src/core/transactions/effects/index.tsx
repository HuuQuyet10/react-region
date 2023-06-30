import { createAsyncThunk } from '@reduxjs/toolkit';
import TransactionServices from '../services';
import {GetTransactionRequest} from "../models";


export const getListTransactionAct = createAsyncThunk(
  'transaction/getListTransaction',
  async (params: GetTransactionRequest, {rejectWithValue})  => {
    try {
      const result = await TransactionServices.getTransactionAPI(params);
      return result.data;
    } catch (error: any) {
      return rejectWithValue({ ...error.response.data});
    }
});


