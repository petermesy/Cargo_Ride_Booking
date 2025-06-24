"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Driver_1 = __importDefault(require("./Driver"));
class Vehicle extends sequelize_1.Model {
}
Vehicle.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    carType: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    plateNumber: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    driverId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, references: { model: 'Drivers', key: 'id' } },
    status: { type: sequelize_1.DataTypes.ENUM('active', 'inactive'), defaultValue: 'inactive' },
    location: { type: sequelize_1.DataTypes.GEOMETRY('POINT'), allowNull: false },
}, {
    sequelize: database_1.default,
    modelName: 'Vehicle',
    tableName: 'Vehicles',
    indexes: [{ type: 'SPATIAL', fields: ['location'] }],
});
Vehicle.belongsTo(Driver_1.default, { foreignKey: 'driverId' });
exports.default = Vehicle;
