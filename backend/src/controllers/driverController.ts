import { Request, Response } from 'express';
import Vehicle from '../models/Vehicle';
import { Sequelize } from 'sequelize';

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const updateStatus = async (req: AuthRequest, res: Response) => {
  const { status, longitude, latitude } = req.body;

  try {
    const vehicle = await Vehicle.findOne({ where: { driverId: req.user!.id } });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    await vehicle.update({
      status,
      location: Sequelize.literal(`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`),
    });

    const io = req.app.get('io');
    io.emit('vehicleStatusUpdate', {
      vehicleId: vehicle.id,
      status,
      location: { type: 'Point', coordinates: [longitude, latitude] },
    });

    res.json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};