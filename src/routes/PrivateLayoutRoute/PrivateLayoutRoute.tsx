import React, { useEffect } from 'react';
import { Route, RouteProps, useLocation } from 'react-router-dom';
import PrivateLayout from "./PrivateLayout";

interface Props extends RouteProps {}


const PrivateLayoutRoute = (props: Props) => {
  const { component: Component, ...rest } = props;

    if (!Component) return null;

  return (
    <Route
      {...rest}
      render={matchProps => {
        return (
          <PrivateLayout>
            <Component {...matchProps} />
          </PrivateLayout>
        );
      }}
    />
  );
};

export default PrivateLayoutRoute;
