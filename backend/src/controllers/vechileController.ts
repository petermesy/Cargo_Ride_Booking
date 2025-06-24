import { Request, Response } from 'express';
import Vehicle from '../models/Vehicle';
import Driver from '../models/Driver';
import { Sequelize } from 'sequelize';

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const getNearbyVehicles = async (req: AuthRequest, res: Response) => {
  const { longitude, latitude, maxDistance = 10000 } = req.query;

  try {
    const vehicles = await Vehicle.findAll({
      where: {
        status: 'active',
        [Sequelize.literal(`ST_DWithin(
          location,
          ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326),
          ${maxDistance}
        )`)]: true,
      },
      include: [{ model: Driver, attributes: ['name', 'phoneNumber'] }],
    });

    const formattedVehicles = vehicles.map((v: any) => ({
      id: v.id,
      carType: v.carType,
      plateNumber: v.plateNumber,
      status: v.status,
      driver: v.Driver,
      location: { type: 'Point', coordinates: v.location.coordinates },
    }));

    res.json(formattedVehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};