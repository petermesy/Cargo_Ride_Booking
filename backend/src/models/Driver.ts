import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface DriverAttributes {
  id?: number;
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  status: 'pending' | 'approved' | 'rejected';
}

class Driver extends Model<DriverAttributes> implements DriverAttributes {
  public id!: number;
  public name!: string;
  public phoneNumber!: string;
  public email!: string;
  public password!: string;
  public status!: 'pending' | 'approved' | 'rejected';
}

// ...existing code...
Driver.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    phoneNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
  },
  {
    sequelize,
    modelName: 'Driver',
    tableName: 'Drivers',
    timestamps: true, // <-- Add this line
  }
);

export default Driver;