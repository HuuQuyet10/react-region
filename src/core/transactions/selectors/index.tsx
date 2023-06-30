import { createSelector } from '@reduxjs/toolkit';
import {RootState} from '../../app.store';

const TransactionState = (state: RootState) => state.transaction;

export const getListTransactionSelector = createSelector(TransactionState, state => state.listTransaction.data || []);
export const getTransactionListPagination = createSelector(TransactionState, state => state.listTransaction.pagination || {});
export const getStateLoadingTransactionList = createSelector(TransactionState, state => state.listTransaction.isLoading);
export const getStateTotalTransactions = createSelector(TransactionState, state => state.listTransaction.totalPrice);

