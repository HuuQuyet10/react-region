import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {getDetailPriceByCustomer, updatePriceByCustomer} from "./effects";
import {GetPriceByCustomerResponse, UpdatePriceResponse} from "./models";


export interface PriceState{
  loadingScreen: boolean,
  isSuccess: boolean,
  priceByCustomerUpdate: {data: UpdatePriceResponse[], isLoading: boolean}
  priceDetailByCustomer: {data: GetPriceByCustomerResponse, isLoading: boolean}
}

const initState: PriceState = {
  loadingScreen: false,
  isSuccess: false,
  priceByCustomerUpdate: {data: [], isLoading: false},
  priceDetailByCustomer: {data: {} as GetPriceByCustomerResponse, isLoading: false},



};
const priceSlice = createSlice({
  name: 'price',
  initialState: initState,
    reducers: {

    },
  extraReducers: builder => {
    builder
      .addCase(updatePriceByCustomer.fulfilled, (state, action) => {
        state.priceByCustomerUpdate.isLoading = false;
        state.priceByCustomerUpdate.data = action.payload || [];
      })
      .addCase(updatePriceByCustomer.pending, (state, action) => {
        state.priceByCustomerUpdate.isLoading = true;
      })
      .addCase(updatePriceByCustomer.rejected, (state, action) => {
        state.priceByCustomerUpdate.isLoading = false;
    });

    builder
      .addCase(getDetailPriceByCustomer.fulfilled, (state, action) => {
        state.priceDetailByCustomer.isLoading = false;
        state.priceDetailByCustomer.data = action.payload[0] || {};
      })
      .addCase(getDetailPriceByCustomer.pending, (state, action) => {
        state.priceDetailByCustomer.isLoading = true;
      })
      .addCase(getDetailPriceByCustomer.rejected, (state, action) => {
        state.priceDetailByCustomer.isLoading = false;
      });


    // builder
    //   .addCase(getJobTypeById.fulfilled, (state, action) => {
    //     state.loadingScreen = false;
    //     state.JobTypeById.data = action.payload || {};
    //   })
    //   .addCase(getJobTypeById.pending, (state, action) => {
    //     state.loadingScreen = true;
    //   })
    //   .addCase(getJobTypeById.rejected, (state, action) => {
    //     state.loadingScreen = false;
    //   });

  },
});
export const {} = priceSlice.actions;
export default priceSlice.reducer;
