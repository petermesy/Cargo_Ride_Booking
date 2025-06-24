import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Vehicle from './Vehicle';
import Driver from './Driver';

interface BookingAttributes {
  id?: number;
  userId: number;
  vehicleId: number;
  driverId: number;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  pickupLocation: string;
  destination: string;
  createdAt?: Date;
}


class Booking extends Model<BookingAttributes> implements BookingAttributes {
  public id!: number;
  public userId!: number;
  public vehicleId!: number;
  public driverId!: number;
  public status!: 'pending' | 'accepted' | 'completed' | 'cancelled';
  public pickupLocation!: string;
  public destination!: string;
  public createdAt!: Date;
}

Booking.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' } },
    vehicleId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Vehicles', key: 'id' } },
    driverId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Drivers', key: 'id' } },
    status: { type: DataTypes.ENUM('pending', 'accepted', 'completed', 'cancelled'), defaultValue: 'pending' },
    pickupLocation: { type: DataTypes.GEOMETRY('POINT'), allowNull: false },
    destination: { type: DataTypes.GEOMETRY('POINT'), allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: 'Booking',
    tableName: 'Bookings',
  }
);

Booking.belongsTo(User, { foreignKey: 'userId' });
Booking.belongsTo(Vehicle, { foreignKey: 'vehicleId' });
Booking.belongsTo(Driver, { foreignKey: 'driverId' });

export default Booking;