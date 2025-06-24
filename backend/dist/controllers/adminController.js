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
exports.getDrivers = exports.createVehicle = exports.approveDriver = void 0;
const Driver_1 = __importDefault(require("../models/Driver"));
const Vehicle_1 = __importDefault(require("../models/Vehicle"));
const approveDriver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driver = yield Driver_1.default.findByPk(req.params.id);
        if (!driver)
            return res.status(404).json({ message: 'Driver not found' });
        yield driver.update({ status: 'approved' });
        res.json(driver);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.approveDriver = approveDriver;
const createVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { carType, plateNumber, driverId, longitude, latitude } = req.body;
    try {
        const driver = yield Driver_1.default.findByPk(driverId);
        if (!driver || driver.status !== 'approved') {
            return res.status(400).json({ message: 'Invalid or unapproved driver' });
        }
        const vehicle = yield Vehicle_1.default.create({
            carType,
            plateNumber,
            driverId,
            status: 'inactive',
            location: Sequelize.literal(`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`),
        });
        res.status(201).json(vehicle);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createVehicle = createVehicle;
const getDrivers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const drivers = yield Driver_1.default.findAll();
        res.json(drivers.map((d) => ({
            id: d.id,
            name: d.name,
            email: d.email,
            phoneNumber: d.phoneNumber,
            status: d.status,
            location: d.location ? { latitude: d.location.coordinates[1], longitude: d.location.coordinates[0] } : null,
        })));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getDrivers = getDrivers;
