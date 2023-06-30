import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getListPermissionCurUser, login} from './effects/admin.effects';
import LocalStorage from "../../utils/LocalStorage";
import {removeHeaderAuthorization} from "../../services/api";
import {UserLoginResponse} from "./model";

export interface UserLoginStateInterface {
  isLoading: boolean,
  isSuccess: boolean,
  isError: boolean,
  errorMessage: string,
  loginUser: UserLoginResponse,
  listPermisions: {data: string[], loading: boolean, error: any}
}

const initState: UserLoginStateInterface = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
  loginUser: {} as UserLoginResponse,
  listPermisions: {data: [], loading: false, error: null}
};
const adminSlice = createSlice({
  name: 'curUserLogin',
  initialState: initState,
  reducers: {
    clearState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = '';
      return state;
    },
    logout(state) {
      LocalStorage.clear();
      removeHeaderAuthorization();
      return initState;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        if (!action.payload.error) {
          state.isSuccess = true;
          state.loginUser = action.payload;
        } else {
          state.errorMessage = action.payload?.error?.message;
        }
      })
      .addCase(login.pending, state => {
        state.isLoading = true;
      })
      .addCase(login.rejected, (state, action) => {
          state.isLoading = false;
        state.errorMessage = "Đã có lỗi khi login.";
      });

    builder
      .addCase(getListPermissionCurUser.pending, state => {
        state.listPermisions = {...state.listPermisions, loading: true};
      })
      .addCase(getListPermissionCurUser.fulfilled, (state, action) => {
        state.listPermisions = {...state.listPermisions, data: action.payload, loading: false};
        state.isLoading = false;
      })
      .addCase(getListPermissionCurUser.rejected, (state, action) => {
        state.listPermisions = {...initState.listPermisions, error: action.payload}
      });
  },
});
export const {clearState, logout} = adminSlice.actions;
export default adminSlice.reducer;
