export const ApiEndpoints = {
  LOGIN: '/auth/login',
  GET_LIST_PERMISSIONS: '/account/permissions',
  USER_LOGIN_CHANGE_PASSWORD: '/account/change-password',
  GET_USER_LIST: '/users',
  GET_LIST_STAFF_QC: '/users/worker',
  GET_LIST_CUSTOMER: '/users/customer',
  GET_USER_BY_ID: '/users/%s',
  CREATE_AN_USER: '/users',
  UPDATE_AN_USER: '/users/%s',
  TOGGLE_ACTIVE_USER: '/users/%s/toggle-status',
  DELETE_AN_USER: '/app-users/%s',

  CREATE_BROADCASTS: '/broadcasts',
  DELETE_BROADCASTS: '/broadcasts/%s',
  UPDATE_BROADCASTS: '/broadcasts/%s',
  GET_BROADCASTS: '/broadcasts/all',


  CREATE_JOB_TYPE: '/job-types',
  UPDATE_JOB_TYPE: '/job-types/%s',
  DELETE_JOB_TYPE: '/job-types/%s',
  GET_ALL_JOB_TYPE: '/job-types',
  GET_JOB_TYPE_BY_ID: '/job-types/%s',


  CREATE_ROLE: '/roles',
  UPDATE_ROLE: '/roles/%s',
  DELETE_ROLE: '/roles/%s',
  GET_ALL_ROLE: '/roles',
  GET_ALL_PERMISSIONS: '/permissions',

  CREATE_A_NEW_JOB: '/jobs',
  UPDATE_JOB: '/jobs/%s',
  UPDATE_STATUS_JOB: '/jobs/%s/update-status',
  UPDATE_JOB_STAFF_ASSIGN: '/jobs/%s/assign-staff',
  UPDATE_JOB_QC_ASSIGN: '/jobs/%s/assign-qc',
  GET_LIST_JOB: '/jobs',
  DELETE_A_JOB: '/jobs/%s',
  GET_JOB_BY_ID: '/jobs/%s',

  UPDATE_PRICES_BY_CUSTOMER: '/prices',
  GET_PRICES_BY_CUSTOMER: '/prices',

  GET_TRANSACTIONS: '/transactions',

  API_ENDPOINT_SOCKET: '/ws/jobs',


};
export default ApiEndpoints;
