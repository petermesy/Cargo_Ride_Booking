import { Request, Response } from 'express';
import Driver from '../models/Driver';
import Vehicle from '../models/Vehicle';

export const approveDriver = async (req: Request, res: Response) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    await driver.update({ status: 'approved' });
    res.json(driver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createVehicle = async (req: Request, res: Response) => {
  const { carType, plateNumber, driverId, longitude, latitude } = req.body;

  try {
    const driver = await Driver.findByPk(driverId);
    if (!driver || driver.status !== 'approved') {
      return res.status(400).json({ message: 'Invalid or unapproved driver' });
    }

    const vehicle = await Vehicle.create({
      carType,
      plateNumber,
      driverId,
      status: 'inactive',
      location: Sequelize.literal(`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`),
    });

    res.status(201).json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDrivers = async (req: Request, res: Response) => {
  try {
    const drivers = await Driver.findAll();
    res.json(drivers.map((d: any) => ({
      id: d.id,
      name: d.name,
      email: d.email,
      phoneNumber: d.phoneNumber,
      status: d.status,
      location: d.location ? { latitude: d.location.coordinates[1], longitude: d.location.coordinates[0] } : null,
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};