import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Persona from './Persona.js';

const RegistroHorario = sequelize.define('RegistroHorario', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
  },
  persona_id: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    references: {
      model: Persona,
      key: 'id',
    },
  },
  tipo: {
    type: DataTypes.ENUM('ingreso', 'egreso'),
    allowNull: false,
  },
  fecha_hora: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'RegistrosHorario',
  timestamps: false,
});

RegistroHorario.belongsTo(Persona, { foreignKey: 'persona_id', as: 'persona' });

export default RegistroHorario;