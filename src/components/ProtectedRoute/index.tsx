import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
//import {RootState} from '../../store';
//import {Role} from '../../types';

import {getIsAuthChecked, getUser} from "../../services/slices/userSlice";


type TProtectedRouteProps = {
    onlyUnAuth?: boolean;
    component: React.JSX.Element; //!!!!!!!!!!!
}
//пример из QnA 11
export const ProtectedRoute = ({ onlyUnAuth = false, component}: TProtectedRouteProps): React.JSX.Element => {
    const user = useSelector(getUser);
    const isAuthChecked = useSelector(getIsAuthChecked);
    const location = useLocation();

    if (!isAuthChecked) {
        return <Preloader />;
    }

    if (!onlyUnAuth && !user) {
        // for authorized user, but user is unauthorized
        return <Navigate to="/login" state={{ from: location }} />
    }

    if (onlyUnAuth && user) {
        // for unauthorized user, but user is authorized
        const { from } = location.state ?? { from: { pathname: "/" } };
        return <Navigate to={from} />;
    }

    // onlyUnAuth && !user for unauthorized and unauthorized
    // !onlyUnAuth && user for authorized and authorized

    return component;
}

export const OnlyAuth = ProtectedRoute;
export const OnlyUnAuth = ({component}: {component: React.JSX.Element}): React.JSX.Element => (
    <ProtectedRoute onlyUnAuth component={component} />
);
