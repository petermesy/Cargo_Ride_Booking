// import { Request, Response } from 'express';
// import Vehicle from '../models/Vehicle';
// import Driver from '../models/Driver';
// import { Sequelize } from 'sequelize';

// interface AuthRequest extends Request {
//   user?: { id: string; role: string };
// }

// export const getNearbyVehicles = async (req: AuthRequest, res: Response) => {
//   const { longitude, latitude, maxDistance = 10000 } = req.query;

//   try {
//     const vehicles = await Vehicle.findAll({
//       where: {
//         status: 'active',
//         [Sequelize.literal(`ST_DWithin(
//           location,
//           ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326),
//           ${maxDistance}
//         )`)]: true,
//       },
//       include: [{ model: Driver, attributes: ['name', 'phoneNumber'] }],
//     });

//     const formattedVehicles = vehicles.map((v: any) => ({
//       id: v.id,
//       carType: v.carType,
//       plateNumber: v.plateNumber,
//       status: v.status,
//       driver: v.Driver,
//       location: { type: 'Point', coordinates: v.location.coordinates },
//     }));

//     res.json(formattedVehicles);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
import { Request, Response } from 'express';
import  Vehicle  from '../models/Vehicle';
import  Driver  from '../models/Driver';
import sequelize from '../config/database';

// ...existing code...

export const getNearbyVehicles = async (req: Request, res: Response) => {
  const { lat, lng, radius } = req.query;
  if (!lat || !lng || !radius) {
    return res.status(400).json({ message: 'lat, lng, and radius are required' });
  }
  try {
    const vehicles = await Vehicle.findAll({
      where: sequelize.literal(`
        ST_DWithin(
          location,
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326),
          ${radius}
        )
      `),
      include: [{ model: Driver, attributes: ['id', 'name', 'phoneNumber'] }],
    });
    res.json(vehicles.map((v: any) => ({
      id: v.id,
      driverId: v.driverId,
      driver: v.Driver,
      location: { type: 'Point', coordinates: v.location.coordinates },
      carType: v.carType,
      plateNumber: v.plateNumber,
      status: v.status,
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ...existing code...