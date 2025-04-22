import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Cargo from './Cargo.js';

const Persona = sequelize.define('Persona', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  dni: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  celular: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  fecha_nac: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  legajo: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: true,
  },
  cargo_id: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    references: {
      model: Cargo,
      key: 'id',
    },
  },
}, {
  tableName: 'Personas',
  timestamps: false,
});

Persona.belongsTo(Cargo, { foreignKey: 'cargo_id', as: 'cargo' });

export default Persona;