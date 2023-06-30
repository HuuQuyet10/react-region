/* eslint-disable no-param-reassign */
import React from 'react';
import {store} from "../core/app.store";
import axios from 'axios';
import util from 'util';
import { baseUrl } from './urlAPI';
import LocalStorage from "../utils/LocalStorage";
import {localStorageKey} from "../constants";
import {logout} from '../core/admin/admin.slice';

import {Modal, notification} from "antd";
import moment, { Moment } from 'moment';
import {showNofi} from "../utils";

// import {logout} from '../core/admin/admin.slice';

export const apiInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: baseUrl,
});

export const setApiHeader = () => {
  const jwToken = LocalStorage.get(localStorageKey.JWT_TOKEN, '');
  if (jwToken) {
    const parseToken = JSON.parse(jwToken);
    apiInstance.defaults.headers['Authorization'] = `Bearer ${parseToken}`;
  }
};

setApiHeader();

const setNewToken = token => {
  const tokenType: string = token.token_type || 'Bearer';
  apiInstance.defaults.headers['Authorization'] = `${tokenType} ${token.access_token}`;
};

export const removeHeaderAuthorization = () => {
  delete apiInstance.defaults.headers['Authorization'];
};


export const axiosMiddleware = (store) => (next) => (action) => {

  if (!action.type.includes('/login/')) {
    apiInstance.interceptors.request.use(async config => {

      const aaa = LocalStorage.get(localStorageKey.EXPIRE_DATE, '');
      const expireDate = aaa ? JSON.parse(aaa) : null;

      if (config.headers && config.headers['Authorization']){
        if (!expireDate || (moment() >= moment(new Date(expireDate)))) {

          notification['info']({
            message: '',
            description: 'For security reason, you have been automatically logged out due to inactivity',
            key: 'errorForceLogout',
            duration: 10
          });

          store.dispatch(logout());
          return;
        }
      }

      return config;
    }, error => {
      return Promise.reject(error);
    });

  }
  return next(action);
};

apiInstance.interceptors.response.use(
  response => {
    // console.log('get new token using refresh token', getLocalRefreshToken());
    return response;
  },

  async error => {
    throw error;
  }
);

// const logoutExp = () => {
//   store.dispatch(logout());
// };



const handleRequest = async (_request, thunkApi?) =>
  _request
    .then(response => response.data)
    .catch(error => {
      if (thunkApi) {
        return thunkApi.rejectWithValue(error?.response?.data || error);
      }
      return Promise.reject(error);
    });

export class api {
  static post =
    (url, axiosConfig = {}) =>
    (params = {}, thunkApi?) => {
      handleRequest(apiInstance.post(url, params, axiosConfig), thunkApi);
    };

  static put =
    (url, axiosConfig = {}) =>
    (params = {}, thunkApi) =>
      handleRequest(apiInstance.put(url, params, axiosConfig), thunkApi);

  static get =
    (url, axiosConfig = {}) =>
    thunkApi =>
      handleRequest(apiInstance.get(url, axiosConfig), thunkApi);

  static delete =
    (url, axiosConfig = {}) =>
    (params = {}, thunkApi) =>
      handleRequest(apiInstance.delete(util.format(url, params), axiosConfig), thunkApi);
}

export const changeHeaderAPI = (headerObject: { [key: string]: any }) => {
  Object.assign(apiInstance.defaults, { headers: headerObject });
};

// export const removeHeaderAuthorization = () => {
//     delete apiInstance.defaults.headers[HeaderKey.JM360_AUTHORIZATION];
// };
