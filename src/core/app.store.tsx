import {
  configureStore,
  ThunkAction,
  Action,
  getDefaultMiddleware,
  createSerializableStateInvariantMiddleware
} from '@reduxjs/toolkit';
import {persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from 'redux-persist';
import storage from 'redux-persist/lib/storage';


import {useDispatch} from 'react-redux';

import rootReducer from './app.reducer';
import {axiosMiddleware} from '../services/api';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['curUserLogin'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    [
      ...getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
      // createSerializableStateInvariantMiddleware(),
      axiosMiddleware],
});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
