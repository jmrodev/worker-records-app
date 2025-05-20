import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Cargo from './Cargo.js';
// import RegistroHorario from './RegistroHorario.js'; // Descomentar si se define la relación hasMany aquí

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
    unique: {
      name: 'unique_dni',
      msg: 'El DNI ya está registrado.'
    },
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: {
      name: 'unique_persona_email',
      msg: 'El email de la persona ya está registrado.'
    },
    validate: {
      isEmail: {
        msg: "Debe ser una dirección de correo válida."
      }
    }
  },
  celular: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  fecha_nac: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  legajo: {
    type: DataTypes.STRING(50),
    unique: {
      name: 'unique_legajo',
      msg: 'El legajo ya está registrado.'
    },
    allowNull: true,
  },
  cargo_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: Cargo,
      key: 'id',
    },
  },
}, {
  tableName: 'Personas',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['dni'] },
    { fields: ['apellido'] },
    { fields: ['cargo_id'] },
    { unique: true, fields: ['legajo'] },
    { fields: ['email'] },
    { fields: ['fecha_nac'] }
  ]
});

Persona.belongsTo(Cargo, {
  foreignKey: 'cargo_id',
  as: 'cargo',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

Cargo.hasMany(Persona, {
  foreignKey: 'cargo_id',
  as: 'personas',
  onDelete: 'SET NULL', // Importante para consistencia si se borra un Cargo
  onUpdate: 'CASCADE'
});

export default Persona;