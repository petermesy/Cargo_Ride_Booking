import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Driver from './Driver';

interface VehicleAttributes {
  id?: number;
  carType: string;
  plateNumber: string;
  driverId: number;
  status: 'active' | 'inactive';
  location: string; // PostGIS POINT
}

class Vehicle extends Model<VehicleAttributes> implements VehicleAttributes {
  public id!: number;
  public carType!: string;
  public plateNumber!: string;
  public driverId!: number;
  public status!: 'active' | 'inactive';
  public location!: string;
}

Vehicle.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    carType: { type: DataTypes.STRING, allowNull: false },
    plateNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    driverId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Drivers', key: 'id' } },
    status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'inactive' },
    location: { type: DataTypes.GEOMETRY('POINT'), allowNull: false },
  },
  {
    sequelize,
    modelName: 'Vehicle',
    tableName: 'Vehicles',
    indexes: [{ type: 'SPATIAL', fields: ['location'] }],
  }
);

Vehicle.belongsTo(Driver, { foreignKey: 'driverId' });

export default Vehicle;