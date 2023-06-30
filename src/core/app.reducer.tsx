import { combineReducers } from 'redux';
import curUserLogin from './admin/admin.slice';
import jobTypeReducer from './jobType/jobType.slice';
import userReducer from './user/user.slice';
import roleReducer from './roleManage/roleManage.slice';
import jobReducer from './jobManage/job.slice';
import PriceSlice from './priceManage/priceManage.slice';
import transactionsSlice from './transactions/transactions.slice';
import socketSlice from './socket/socket.slice';

export const rootReducer = combineReducers({
  curUserLogin: curUserLogin,
  user: userReducer,
  jobType: jobTypeReducer,
  role: roleReducer,
  job: jobReducer,
  price: PriceSlice,
  transaction: transactionsSlice,
  socket: socketSlice,
});

export default rootReducer;
