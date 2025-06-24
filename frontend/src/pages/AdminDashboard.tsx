import React, { useEffect, useState } from 'react';
import CardComponent from '../components/CardComponent';
import api from '../services/api';
import { Driver } from '../types.ts';

const AdminDashboard: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const { data } = await api.get('/admin/drivers', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setDrivers(data);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };
    fetchDrivers();
  }, []);

  const updateDriverStatus = async (driverId: string, status: string) => {
    try {
      await api.put(
        `/admin/drivers/${driverId}`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setDrivers(drivers.map((d) => (d.id === driverId ? { ...d, status } : d)));
    } catch (error) {
      console.error('Error updating driver status:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <CardComponent title="Manage Drivers">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2 text-left">Phone</th>
                <th className="border p-2 text-left">Status</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.id}>
                  <td className="border p-2">{driver.name}</td>
                  <td className="border p-2">{driver.email}</td>
                  <td className="border p-2">{driver.phoneNumber}</td>
                  <td className="border p-2">{driver.status}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => updateDriverStatus(driver.id, 'approved')}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600"
                      disabled={driver.status === 'approved'}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateDriverStatus(driver.id, 'rejected')}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      disabled={driver.status === 'rejected'}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardComponent>
    </div>
  );
};

export default AdminDashboard;