"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
const Vehicle_1 = __importDefault(require("./Vehicle"));
const Driver_1 = __importDefault(require("./Driver"));
class Booking extends sequelize_1.Model {
}
Booking.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' } },
    vehicleId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: 'Vehicles', key: 'id' } },
    driverId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: 'Drivers', key: 'id' } },
    status: { type: sequelize_1.DataTypes.ENUM('pending', 'accepted', 'completed', 'cancelled'), defaultValue: 'pending' },
    pickupLocation: { type: sequelize_1.DataTypes.GEOMETRY('POINT'), allowNull: false },
    destination: { type: sequelize_1.DataTypes.GEOMETRY('POINT'), allowNull: false },
    createdAt: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
}, {
    sequelize: database_1.default,
    modelName: 'Booking',
    tableName: 'Bookings',
});
Booking.belongsTo(User_1.default, { foreignKey: 'userId' });
Booking.belongsTo(Vehicle_1.default, { foreignKey: 'vehicleId' });
Booking.belongsTo(Driver_1.default, { foreignKey: 'driverId' });
exports.default = Booking;
