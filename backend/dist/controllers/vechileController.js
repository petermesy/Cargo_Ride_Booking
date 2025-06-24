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
exports.getNearbyVehicles = void 0;
const Vehicle_1 = __importDefault(require("../models/Vehicle"));
const Driver_1 = __importDefault(require("../models/Driver"));
const sequelize_1 = require("sequelize");
const getNearbyVehicles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { longitude, latitude, maxDistance = 10000 } = req.query;
    try {
        const vehicles = yield Vehicle_1.default.findAll({
            where: {
                status: 'active',
                [sequelize_1.Sequelize.literal(`ST_DWithin(
          location,
          ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326),
          ${maxDistance}
        )`)]: true,
            },
            include: [{ model: Driver_1.default, attributes: ['name', 'phoneNumber'] }],
        });
        const formattedVehicles = vehicles.map((v) => ({
            id: v.id,
            carType: v.carType,
            plateNumber: v.plateNumber,
            status: v.status,
            driver: v.Driver,
            location: { type: 'Point', coordinates: v.location.coordinates },
        }));
        res.json(formattedVehicles);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getNearbyVehicles = getNearbyVehicles;
