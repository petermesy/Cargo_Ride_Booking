export interface User {
  id: string;
  role: string;
}

export interface Vehicle {
  id: string;
  carType: string;
  plateNumber: string;
  driver: { name: string; phoneNumber: string };
  location: { type: string; coordinates: [number, number] };
  status: string;
}

export interface Booking {
  id: string;
  user: { name: string };
  status: string;
  pickupLocation: { type: string; coordinates: [number, number] };
  destination: { type: string; coordinates: [number, number] };
}

export interface Driver {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  status: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  speed?: number;
  timestamp?: string;
  altitude?: number;
  accuracy?: number;
}