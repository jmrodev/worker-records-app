import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Persona from './Persona.js';

const RegistroHorario = sequelize.define('RegistroHorario', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  persona_id: {
    type: DataTypes.UUID,
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
  timestamps: true, // MODIFICADO: Considerar true para tener createdAt/updatedAt
  indexes: [
    {
      fields: ['persona_id']
    },
    {
      fields: ['tipo']
    },
    {
      fields: ['fecha_hora']
    }
  ]
});

RegistroHorario.belongsTo(Persona, {
  foreignKey: 'persona_id',
  as: 'persona',
  onDelete: 'CASCADE', // Si se borra una persona, se borran sus registros
  onUpdate: 'CASCADE'
});

Persona.hasMany(RegistroHorario, {
  foreignKey: 'persona_id',
  as: 'registrosHorario',
  onDelete: 'CASCADE', // Consistente con la FK
  onUpdate: 'CASCADE'
});

export default RegistroHorario;