import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import UserDashboard from './pages/UserDashboard';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/user"
          element={<PrivateRoute component={UserDashboard} role="user" />}
        />
        <Route
          path="/driver"
          element={<PrivateRoute component={DriverDashboard} role="driver" />}
        />
        <Route
          path="/admin"
          element={<PrivateRoute component={AdminDashboard} role="admin" />}
        />
        <Route
          path="/"
          element={
            user ? <Navigate to={`/${user.role}`} replace /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;