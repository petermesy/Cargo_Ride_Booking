import React, { useEffect, useState } from 'react';
import MapComponent from '../components/MapComponent';
import CardComponent from '../components/CardComponent';
import api from '../services/api';
import { Vehicle } from '../types.ts';

const UserDashboard: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | undefined>();

  useEffect(() => {
    // Fetch nearby vehicles
    const fetchVehicles = async () => {
      try {
        const { data } = await api.get('/vehicles/nearby', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          params: { lat: -1.2921, lng: 36.8219, radius: 10000 }, // Nairobi
        });
        setVehicles(data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };
    fetchVehicles();

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);

const handleBookVehicle = async (vehicleId: string) => {
  try {
    await api.post(
      '/bookings',
      {
        vehicleId,
        pickupLocation: userLocation
          ? { type: 'Point', coordinates: [userLocation.longitude, userLocation.latitude] }
          : undefined,
        destination: userLocation
          ? { type: 'Point', coordinates: [userLocation.longitude, userLocation.latitude] }
          : undefined,
      },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    alert('Booking created!');
  } catch (error) {
    console.error('Error booking vehicle:', error);
    alert('Failed to book vehicle.');
  }
};

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <MapComponent vehicles={vehicles} employeeLocation={userLocation} />
        </div>
        <div>
          <CardComponent title="Available Vehicles">
            {vehicles.length > 0 ? (
              <ul className="space-y-2">
                {vehicles.map((vehicle) => (
                  <li key={vehicle.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{vehicle.carType}</p>
                      <p className="text-sm text-gray-500">{vehicle.plateNumber}</p>
                      <p className="text-sm text-gray-500">Driver: {vehicle.driver.name}</p>
                    </div>
                    <button
                      onClick={() => handleBookVehicle(vehicle.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Book
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No vehicles available.</p>
            )}
          </CardComponent>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;