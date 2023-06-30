import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {GetTransactionResponse} from "./models";
import {getListTransactionAct} from "./effects";
import {PaginationModel} from "../../models";


export interface TransactionsState{
  loadingScreen: boolean,
  isSuccess: boolean,
  listTransaction: {data: GetTransactionResponse[], isLoading: boolean, pagination: PaginationModel, totalPrice: number}
}

const initState: TransactionsState = {
  loadingScreen: false,
  isSuccess: false,
  listTransaction: {data: [], isLoading: false, pagination: {} as PaginationModel, totalPrice: 0},

};
const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: initState,
    reducers: {

    },
  extraReducers: builder => {
    builder
      .addCase(getListTransactionAct.fulfilled, (state, action) => {
        state.listTransaction.isLoading = false;
        state.listTransaction.data = action.payload.data || [];
        state.listTransaction.pagination = {
          pageNumber: action.payload.pageNumber,
          pageSize: action.payload.pageSize,
          total: action.payload.total,
          totalPage: action.payload.totalPage,
        };
        state.listTransaction.totalPrice = action.payload.totalPrice
      })
      .addCase(getListTransactionAct.pending, (state, action) => {
        state.listTransaction.isLoading = true;
      })
      .addCase(getListTransactionAct.rejected, (state, action) => {
        state.listTransaction.isLoading = false;
    });

  },
});
export const {} = transactionsSlice.actions;
export default transactionsSlice.reducer;
