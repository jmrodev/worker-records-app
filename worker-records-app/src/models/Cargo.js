import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Cargo = sequelize.define('Cargo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
}, {
  tableName: 'Cargos',
  timestamps: false,
});

export default Cargo;