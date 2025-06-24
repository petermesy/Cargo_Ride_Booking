import React, { useEffect, useState, useContext } from 'react';
import socket from '../services/socket';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const DriverDashboard: React.FC = () => {
  const [status, setStatus] = useState('inactive');
  const { user } = useContext(AuthContext);

useEffect(() => {
  socket.on('connect', () => {
    console.log('Socket.IO connected');
  });

  socket.on('connect_error', (error: any) => {
    console.error('Socket.IO connection error:', error);
  });

  socket.on('driverStatusUpdate', (data: any) => {
    if (data.driverId === user?.id) {
      setStatus(data.status);
    }
  });

  return () => {
    socket.off('connect');
    socket.off('connect_error');
    socket.off('driverStatusUpdate');
  };
}, [user]);
// ...rest of your component...

  const toggleStatus = async () => {
    const newStatus = status === 'active' ? 'inactive' : 'active';
    try {
      await api.put(
        '/vehicles/status',
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      socket.emit('driverStatusUpdate', { driverId: user?.id, status: newStatus });
      setStatus(newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Driver Dashboard</h1>
      <p>Status: {status}</p>
      <button
        onClick={toggleStatus}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Toggle Status
      </button>
    </div>
  );
};

export default DriverDashboard;