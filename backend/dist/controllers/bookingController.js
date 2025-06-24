"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentBooking = exports.getDriverBookings = exports.createBooking = void 0;
const Booking_1 = __importDefault(require("../models/Booking"));
const Vehicle_1 = __importDefault(require("../models/Vehicle"));
const sequelize_1 = require("sequelize");
const User_1 = __importDefault(require("../models/User")); // <-- Add this line
const createBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vehicleId, pickupLocation, destination } = req.body;
    try {
        const vehicle = yield Vehicle_1.default.findByPk(vehicleId);
        if (!vehicle || vehicle.status !== 'active') {
            return res.status(400).json({ message: 'Vehicle unavailable' });
        }
        const booking = yield Booking_1.default.create({
            userId: req.user.id,
            vehicleId,
            driverId: vehicle.driverId,
            status: 'pending',
            pickupLocation: sequelize_1.Sequelize.literal(`ST_SetSRID(ST_MakePoint(${pickupLocation.coordinates[0]}, ${pickupLocation.coordinates[1]}), 4326)`),
            destination: sequelize_1.Sequelize.literal(`ST_SetSRID(ST_MakePoint(${destination.coordinates[0]}, ${destination.coordinates[1]}), 4326)`),
        });
        const io = req.app.get('io');
        io.emit('newBooking', { bookingId: booking.id, vehicleId });
        res.json(booking);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createBooking = createBooking;
const getDriverBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookings = yield Booking_1.default.findAll({
            where: { driverId: req.user.id },
            include: [{ model: User_1.default, attributes: ['name'] }],
        });
        res.json(bookings);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getDriverBookings = getDriverBookings;
// export const getCurrentBooking = async (req: Request, res: Response) => {
//   try {
//     const booking = await Booking.findOne({
//       where: { driverId: (req as any).user.id, status: 'accepted' },
//       include: [{ model: User, as: 'user', attributes: ['name'] }],
//     });
//     res.json(booking || null);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
const getCurrentBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booking = yield Booking_1.default.findOne({
            where: {
                driverId: req.user.id,
                status: ['pending', 'accepted'],
            },
            include: [{ model: User_1.default, attributes: ['name'] }],
        });
        if (booking) {
            // Normalize user field for frontend compatibility
            const plain = booking.toJSON();
            plain.user = plain.User;
            delete plain.User;
            res.json(plain);
        }
        else {
            res.json(null);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getCurrentBooking = getCurrentBooking;
