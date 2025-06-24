import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Vehicle } from '../types.ts';

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const UserDashboard: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data } = await api.get('/vehicles/nearby', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          params: { lat: -1.2921, lng: 36.8219, radius: 10000 }, // Nairobi coordinates
        });
        setVehicles(data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };
    fetchVehicles();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <MapContainer center={[-1.2921, 36.8219]} zoom={13} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {vehicles.map((vehicle) => (
          <Marker
            key={vehicle.id}
            position={[vehicle.location.coordinates[1], vehicle.location.coordinates[0]]}
          >
            <Popup>
              {vehicle.carType} - {vehicle.plateNumber}<br />
              Driver: {vehicle.driver.name}<br />
              Status: {vehicle.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default UserDashboard;