import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface PrivateRouteProps {
  component: React.ComponentType<any>;
  role: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, role }) => {
  const { user } = useContext(AuthContext);

  return user && user.role === role ? <Component /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;