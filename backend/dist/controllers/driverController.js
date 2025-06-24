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
exports.updateStatus = void 0;
const Vehicle_1 = __importDefault(require("../models/Vehicle"));
const sequelize_1 = require("sequelize");
const updateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, longitude, latitude } = req.body;
    try {
        const vehicle = yield Vehicle_1.default.findOne({ where: { driverId: req.user.id } });
        if (!vehicle)
            return res.status(404).json({ message: 'Vehicle not found' });
        yield vehicle.update({
            status,
            location: sequelize_1.Sequelize.literal(`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`),
        });
        const io = req.app.get('io');
        io.emit('vehicleStatusUpdate', {
            vehicleId: vehicle.id,
            status,
            location: { type: 'Point', coordinates: [longitude, latitude] },
        });
        res.json(vehicle);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateStatus = updateStatus;
