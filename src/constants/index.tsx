import * as RouteConst from './RouteConst';

export default RouteConst;

export const DateFormatFull = 'DD-MM-YYYY HH:mm';

export const CurrencyKey = {
  KEY_USD: 'USD',
  SYMBOL_USD: '$',
  KEY_VND: 'VND',
  SYMBOL_VND: 'đ',
};

export const HeaderKey = {
  AUTHORIZATION: 'Authorization',
  REFRESH_TOKEN: 'refreshToken',
};

export const localStorageKey = {
  EXPIRE_DATE: 'expireDate',
  JWT_TOKEN: 'jwtToken',
}


export const StatusUser = {
  ACTIVE: 'ACTIVE',
  INACTIVE : 'INACTIVE ',
};

export const JobStatusToDisPlay = {
  CREATED: 'Created',
  CONFIRMED: 'Confirmed',
  DOING: 'Doing',
  REVIEWING: 'Reviewing',
  WAITING_REVIEW: 'Waiting Rreview',
  COMPLETED: 'Completed',
  COMPLETED_LATE: 'Completed Late',
};


export type NotificationType = 'warn' | 'open' | 'success' | 'error' | 'info';


export const permissionList = [
  {id: 1, name: 'Permission 1'},
  {id: 2, name: 'Permission 2'},
  {id: 3, name: 'Permission 3'},
  {id: 4, name: 'Permission 4'},
  {id: 5, name: 'Permission 5'},
  {id: 6, name: 'Permission 6'},
  {id: 7, name: 'Permission 7'},
  {id: 8, name: 'Permission 8'},
  {id: 9, name: 'Permission 9'},
];


export const passwordRegexValidateMsg = 'Passwords must be at least 8 characters and contain uppercase, lowercase, numeric, at least 1 character: "@ $ ! % * ? &" and at least 1 uppercase character';
// export const passwordRegexValidateMsg = 'Mật khẩu phải bao gồm chữ hoa, chữ thường, số, và 1 trong các kí tự  " @ $ ! % * ? & "';


export const RoleConst = {
  ADMIN: 1,
  QCA: 2,
  STAFF: 3,
  CUSTOMER: 4,
};

export const NOT_HAVE_PERMISSION_MESSAGE = 'You do not have permission to do this action!'


