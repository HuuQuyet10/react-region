import {createAsyncThunk} from '@reduxjs/toolkit';
import AdminServices from '../services';
import {setApiHeader} from "../../../services/api";
import LocalStorage from "../../../utils/LocalStorage";
import {PermisionItem} from "../model";
import {localStorageKey} from "../../../constants";
import moment from 'moment';


export const login = createAsyncThunk('curUserLogin/login', async (params: { username, password }, {dispatch, rejectWithValue}) => {
  try {
    const result = (await AdminServices.loginAPI(params)).data;
    if (!result.error) {

      let token = result.token;
      LocalStorage.set(localStorageKey.JWT_TOKEN, JSON.stringify(token));

      const expirationTime = moment().add(1, 'days');
      LocalStorage.set(localStorageKey.EXPIRE_DATE, JSON.stringify(expirationTime));

      await setApiHeader();
      await dispatch(getListPermissionCurUser());

      return result;
    } else {
      return rejectWithValue({error: {message: 'Đã có lỗi khi login.'}});
    }

  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getListPermissionCurUser = createAsyncThunk('curUserLogin/getListPermissionCurUser', async (_, {rejectWithValue}) => {
  try {
    const result = (await AdminServices.getListPermissionCurUserAPI()).data;
    const listPermision = result?.map((item: PermisionItem) => item.name);
    return listPermision;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});


export const changePasswordAct = createAsyncThunk('curUserLogin/changePassword', async (params: { currentPassword, newPassword }, {dispatch, rejectWithValue}) => {
  try {
    const result = (await AdminServices.changePasswordAPI(params)).data;
    return result;

  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});










