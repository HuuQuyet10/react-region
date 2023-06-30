import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import PrivateRoutes from './routes/PrivateLayoutRoute/PrivateRoutes';
import LoginPage from './pages/Login';
import './styles/global.scss';
import 'react-quill/dist/quill.snow.css';
import * as RouteConst from './constants/RouteConst';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={RouteConst.LOGIN_URL} component={LoginPage} />
        <PrivateRoutes />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
