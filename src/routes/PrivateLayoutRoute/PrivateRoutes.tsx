import React, {useCallback, useEffect, useState} from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import { useAppDispatch} from '../../core/app.store';
import PrivateLayoutRoute from "./PrivateLayoutRoute";
import get from "lodash/get";
import {getMenuFromConfig, getRoutesFromConfig} from "../../utils";
import PrivateRoutesConfig, {RouteConfig} from '../config/PrivateRoutesConfig';
import {Layout} from 'antd';
import './style.scss';
import * as RouteConst from "../../constants/RouteConst";
import {Route, RouteProps} from "react-router";
import SideBar from "../../components/SideBar/SideBar";
import {getLoginUserSelector} from "../../core/admin/selectors";
import PageNotFound from "../../pages/404";
import {getBroadcasts} from "../../core/user/effects";


const PrivateRoutes: React.FC<RouteProps> = () => {
  const dispatch = useAppDispatch();

    const loginUser = useSelector(getLoginUserSelector);



  let allowedRoutes: Array<RouteConfig> = [];
  let routerMenu: any = [];

  if (!_.isEmpty(loginUser)) {
      allowedRoutes = getRoutesFromConfig(PrivateRoutesConfig);

      routerMenu = getMenuFromConfig(PrivateRoutesConfig);

  } else {
    // return <Redirect to={RouteConst.LOGIN_URL} />;
    // return null
  }


  // const [allowRouting, setAllowRouting] = useState<RouteConfig[]>([]);
  // const [routerMenus, setRouterMenus] = useState<any[]>([]);
  // useEffect(() => {
  //   if (!_.isEmpty(loginUser)) {
  //     allowedRoutes = getRoutesFromConfig(PrivateRoutesConfig);
  //     routerMenu = getMenuFromConfig(PrivateRoutesConfig);
  //
  //     setRouterMenus(routerMenu);
  //     setAllowRouting(allowedRoutes);
  //
  //   }
  // }, []);

  useEffect(() => {
      getBroadcastsMessage();
  }, []);

  const getBroadcastsMessage = () => {
      dispatch(getBroadcasts());
  };

  return (
    <>
      {!_.isEmpty(allowedRoutes) ? (
        <Layout className="private-layout" hasSider>
          <SideBar routes={routerMenu} />

          <Switch>
            {allowedRoutes.map(item => {
              return (
                <PrivateLayoutRoute exact={item?.exact} path={item.path} component={item.component} key={item.path} />
              );
            })}

              <PrivateLayoutRoute exact={true} path={"*"} component={PageNotFound} />
            {/*<Redirect to={RouteConst.LOGIN_URL} />*/}
          </Switch>
        </Layout>
      ) : <Redirect to={RouteConst.LOGIN_URL} />}
    </>
  );
};

export default PrivateRoutes;
