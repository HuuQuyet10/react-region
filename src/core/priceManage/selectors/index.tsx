import { createSelector } from '@reduxjs/toolkit';
import {RootState} from '../../app.store';

const PriceState = (state: RootState) => state.price;

export const updatePriceByCustomerSelector = createSelector(PriceState, state => state.priceByCustomerUpdate.data || []);
export const loadingUpdatePriceByCustomerSelector = createSelector(PriceState, state => state.priceByCustomerUpdate.isLoading);

export const getPriceByCustomerSelector = createSelector(PriceState, state => state.priceDetailByCustomer.data || {});
export const loadingGetPriceByCustomerSelector = createSelector(PriceState, state => state.priceDetailByCustomer.isLoading);

