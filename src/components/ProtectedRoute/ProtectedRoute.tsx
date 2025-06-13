import React, { ReactElement } from 'react';
import { useSelector } from '../../services/store';

import {
  isAuthCheckedSelector,
  userSelector, loginUserRequestSelector
} from '../../services/slices/userSlice';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const user = useSelector(userSelector);
  const location = useLocation();
  const login = useSelector(loginUserRequestSelector);

  if (!isAuthChecked && login) {
    return <Preloader />;
  }


  if (!onlyUnAuth && !isAuthChecked) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const { from } = location.state ?? { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }
  return children;
};
