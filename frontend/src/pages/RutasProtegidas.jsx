import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../pages/context/AuthContext';

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { token, role } = useContext(AuthContext);
  const isLoggedIn = Boolean(token);


  if (!isLoggedIn) return <Navigate to="/" />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }
  return children;
};

export default RoleBasedRoute;
