import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface AdminAttributes {
  id?: number;
  email: string;
  password: string;
}

class Admin extends Model<AdminAttributes> implements AdminAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
}

Admin.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: 'Admin',
    tableName: 'Admins',
    timestamps: false, // Disable createdAt/updatedAt
  }
);

export default Admin;