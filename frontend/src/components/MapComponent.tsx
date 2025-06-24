import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { Location, Vehicle } from '../types.ts';

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const carIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/61/61168.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const userIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface MapComponentProps {
  vehicles?: Vehicle[];
  employeeLocation?: Location;
  employeeId?: string;
  isDriver?: boolean;
  driverId?: string;
  driverLocation?: Location;
}

const MapComponent: React.FC<MapComponentProps> = ({
  vehicles = [],
  employeeLocation,
  employeeId,
  isDriver = false,
  driverId,
  driverLocation,
}) => {
  const [route, setRoute] = useState<[number, number][]>([]);
  const [distance, setDistance] = useState<number>(0);
  const [eta, setEta] = useState<number>(0);
  const [carLocationName, setCarLocationName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const employeeLatLng = employeeLocation
    ? [employeeLocation.latitude, employeeLocation.longitude]
    : undefined;
  const driverLatLng = driverLocation
    ? [driverLocation.latitude, driverLocation.longitude]
    : undefined;

  // Fetch route using GraphHopper
  useEffect(() => {
    const fetchRoute = async () => {
      if (!employeeLatLng || !driverLatLng) return;
      const apiKey = 'a2618160-4888-4804-be62-891f5cba83c9'; // Replace with your GraphHopper key
      const url = `https://graphhopper.com/api/1/route?point=${driverLatLng[0]},${driverLatLng[1]}&point=${employeeLatLng[0]},${employeeLatLng[1]}&vehicle=car&locale=en&key=${apiKey}`;

      try {
        const response = await axios.get(url);
        if (response.data.paths && response.data.paths.length > 0) {
          const points = response.data.paths[0].points.coordinates.map(
            (coord: [number, number]) => [coord[1], coord[0]]
          );
          setRoute(points);
          setDistance(response.data.paths[0].distance);
          setEta(response.data.paths[0].time / 1000);
        } else {
          setError('No route found');
          setRoute([]);
          setDistance(0);
          setEta(0);
        }
      } catch (error) {
        setError('Error fetching route');
        setRoute([]);
        setDistance(0);
        setEta(0);
      }
    };
    fetchRoute();
  }, [employeeLatLng, driverLatLng]);

  // Reverse geocode driver location
  useEffect(() => {
    const reverseGeocode = async (lat: number, lng: number) => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );
        setCarLocationName(response.data.display_name || 'Unknown location');
      } catch (error) {
        setCarLocationName('Unknown location');
      }
    };
    if (driverLatLng) {
      reverseGeocode(driverLatLng[0], driverLatLng[1]);
    }
  }, [driverLatLng]);

  const etaString = eta
    ? eta < 60
      ? 'Less than a minute'
      : `${Math.round(eta / 60)} min`
    : '--';
  const distanceString = distance ? `${(distance / 1000).toFixed(2)} km` : '--';

  const center = employeeLatLng || driverLatLng || [-1.2921, 36.8219]; // Nairobi default

  return (
    <div className="w-full flex flex-col">
      <div className="relative flex-grow" style={{ minHeight: '400px' }}>
<MapContainer
  center={center as [number, number]}
  zoom={14}
  style={{ height: '400px', width: '100%' }}
>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution="© OpenStreetMap contributors"
  />
  {employeeLatLng && (
    <Marker position={employeeLatLng as [number, number]} icon={userIcon}>
      <Popup>You</Popup>
    </Marker>
  )}
  {vehicles.map((vehicle) => (
    <Marker
      key={vehicle.id}
      position={[
        vehicle.location.coordinates[1], // latitude
        vehicle.location.coordinates[0], // longitude
      ]}
      icon={carIcon}
    >
      <Popup>
        {vehicle.carType} - {vehicle.plateNumber}
        <br />
        Driver: {vehicle.driver.name}
        <br />
        Status: {vehicle.status}
      </Popup>
    </Marker>
  ))}
  {driverLatLng && (
    <Marker position={driverLatLng as [number, number]} icon={carIcon}>
      <Popup>
        Driver
        <br />
        {carLocationName && (
          <>
            <span className="font-semibold">Location:</span> {carLocationName}
            <br />
          </>
        )}
        Lat: {driverLatLng[0].toFixed(6)}, Lng: {driverLatLng[1].toFixed(6)}
      </Popup>
    </Marker>
  )}
  {route.length > 0 && <Polyline positions={route} color="blue" />}
</MapContainer>
        <div className="absolute bottom-4 left-0 right-0 mx-auto w-11/12 sm:w-2/3 bg-white shadow-lg rounded-lg p-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-gray-500">Distance</p>
              <p className="font-medium">{distanceString}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">ETA</p>
              <p className="font-medium">{etaString}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Driver Location</p>
              <p className="font-medium text-sm">{carLocationName || '--'}</p>
            </div>
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
    </div>
  );
};

export default MapComponent;