import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Cargo = sequelize.define('Cargo', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      name: 'unique_cargo_nombre',
      msg: 'El nombre del cargo ya existe.'
    }
  },
  tipo: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
}, {
  tableName: 'Cargos',
  timestamps: false,
  indexes: [
    {
      fields: ['nombre']
    },
    {
      fields: ['tipo']
    }
  ]
});

export default Cargo;