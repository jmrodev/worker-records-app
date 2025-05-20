import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: {
      name: 'unique_username',
      msg: 'El nombre de usuario ya está en uso.'
    },
    validate: {
      notEmpty: { msg: 'El nombre de usuario no puede estar vacío.' },
      len: {
        args: [3, 50],
        msg: 'El nombre de usuario debe tener entre 3 y 50 caracteres.'
      }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      name: 'unique_email',
      msg: 'El email ya está registrado.'
    },
    validate: {
      isEmail: {
        msg: "Debe ser una dirección de correo válida."
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La contraseña no puede estar vacía.' },
      len: {
        args: [6, 100],
        msg: 'La contraseña debe tener al menos 6 caracteres.'
      }
    }
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  rol: {
    type: DataTypes.ENUM('admin', 'supervisor', 'usuario'),
    allowNull: false,
    defaultValue: 'usuario'
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  ultimo_login: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'Usuarios',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['username']
    },
    {
      unique: true,
      fields: ['email']
    }
  ],
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.password) {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('password') && usuario.password) {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      }
    }
  }
});

Usuario.prototype.comparePassword = async function(candidatePassword) {
  if (!candidatePassword || !this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export default Usuario;