import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

const RoleBasedRoute = ({ allowedRoles }) => {
  const { isLoggedIn, userRole } = useContext(AuthContext);

  if (!isLoggedIn) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(userRole)) {

    return <Navigate to="/unauthorized" />;
  }
  return <Outlet />;
};

export default RoleBasedRoute;
