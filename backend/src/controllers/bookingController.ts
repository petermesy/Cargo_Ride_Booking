import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Vehicle from '../models/Vehicle';
import { Sequelize } from 'sequelize';
import User from '../models/User'; // <-- Add this line

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const createBooking = async (req: AuthRequest, res: Response) => {
  const { vehicleId, pickupLocation, destination } = req.body;

  try {
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle || vehicle.status !== 'active') {
      return res.status(400).json({ message: 'Vehicle unavailable' });
    }

    const booking = await Booking.create({
      userId: req.user!.id,
      vehicleId,
      driverId: vehicle.driverId,
      status: 'pending',
      pickupLocation: Sequelize.literal(`ST_SetSRID(ST_MakePoint(${pickupLocation.coordinates[0]}, ${pickupLocation.coordinates[1]}), 4326)`),
      destination: Sequelize.literal(`ST_SetSRID(ST_MakePoint(${destination.coordinates[0]}, ${destination.coordinates[1]}), 4326)`),
    });

    const io = req.app.get('io');
    io.emit('newBooking', { bookingId: booking.id, vehicleId });

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDriverBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.findAll({
      where: { driverId: req.user!.id },
      include: [{ model: User, attributes: ['name'] }],
    });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};