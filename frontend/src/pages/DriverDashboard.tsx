import React, { useEffect, useState, useContext } from 'react';
import MapComponent from '../components/MapComponent';
import CardComponent from '../components/CardComponent';
import socket from '../services/socket';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Booking } from '../types.ts';

const DriverDashboard: React.FC = () => {
  const [status, setStatus] = useState('inactive');
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | undefined>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const { user } = useContext(AuthContext);

// ...existing code...
  useEffect(() => {
    // Socket.IO setup
    socket.on('connect', () => console.log('Socket.IO connected'));
    socket.on('connect_error', (error: any) => console.error('Socket.IO connection error:', error));
    socket.on('driverStatusUpdate', (data: any) => {
      if (data.driverId === user?.id) {
        setStatus(data.status);
      }
    });
// ...existing code...

    // Fetch current booking
    const fetchBooking = async () => {
      try {
        const { data } = await api.get('/bookings/current', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking:', error);
      }
    };
    fetchBooking();

    // Get driver location
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCurrentLocation(location);
          socket.emit('driverLocationUpdate', { driverId: user?.id, location });
        },
        (error) => {
          console.error('Error getting driver location:', error);
        }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('driverStatusUpdate');
    };
  }, [user]);

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
        <MapComponent
  isDriver={true}
  driverId={user?.id}
  vehicles={[]}
  employeeLocation={
    booking?.pickupLocation
      ? {
          latitude: booking.pickupLocation.coordinates[1],
          longitude: booking.pickupLocation.coordinates[0],
        }
      : undefined
  }
  driverLocation={currentLocation}
/>
        </div>
        <div>
          <CardComponent title="Driver Status">
            <div className="flex flex-col space-y-2">
              <p>Status: <span className="font-medium">{status}</span></p>
              <button
                onClick={toggleStatus}
                className={`px-4 py-2 rounded text-white ${status === 'active' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
              >
                {status === 'active' ? 'Go Offline' : 'Go Online'}
              </button>
              {booking && (
                <div>
                  <p className="font-medium">Current Booking</p>
                  <p className="text-sm">User: {booking.user?.name || 'N/A'}</p>
                  <p className="text-sm">Status: {booking.status}</p>
                </div>
              )}
            </div>
          </CardComponent>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;