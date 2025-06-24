"use strict";
// import { Request, Response } from 'express';
// import Vehicle from '../models/Vehicle';
// import Driver from '../models/Driver';
// import { Sequelize } from 'sequelize';
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
const database_1 = __importDefault(require("../config/database"));
// ...existing code...
const getNearbyVehicles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lat, lng, radius } = req.query;
    if (!lat || !lng || !radius) {
        return res.status(400).json({ message: 'lat, lng, and radius are required' });
    }
    try {
        const vehicles = yield Vehicle_1.default.findAll({
            where: database_1.default.literal(`
        ST_DWithin(
          location,
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326),
          ${radius}
        )
      `),
            include: [{ model: Driver_1.default, attributes: ['id', 'name', 'phoneNumber'] }],
        });
        res.json(vehicles.map((v) => ({
            id: v.id,
            driverId: v.driverId,
            driver: v.Driver,
            location: { type: 'Point', coordinates: v.location.coordinates },
            carType: v.carType,
            plateNumber: v.plateNumber,
            status: v.status,
        })));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getNearbyVehicles = getNearbyVehicles;
// ...existing code...
