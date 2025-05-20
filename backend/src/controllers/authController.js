import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import Usuario from '../models/Usuario.js';
import { 
  sendSuccess, 
  sendCreated,
  sendPaginated,
  sendUnauthorized,
} from '../utils/responseHandler.js';
import logger from '../utils/logger.js';
import { validationResult } from 'express-validator';

export const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors);
  }
  try {
    const { username, email, password, nombre, apellido, rol } = req.body;
    const nuevoUsuario = await Usuario.create({
      username, email, password, nombre, apellido, rol: rol || 'usuario'
    });
    const usuarioCreado = nuevoUsuario.toJSON();
    delete usuarioCreado.password;
    const token = jwt.sign(
      { id: usuarioCreado.id, username: usuarioCreado.username, rol: usuarioCreado.rol },
      process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    return sendCreated(res, {
      message: 'Usuario registrado exitosamente.', usuario: usuarioCreado, token
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors);
  }
  try {
    const { username, password } = req.body;
    const usuario = await Usuario.findOne({
      where: { [Op.or]: [{ username: username }, { email: username }] }
    });
    if (!usuario) return sendUnauthorized(res, 'Credenciales inválidas.');
    const passwordValido = await usuario.comparePassword(password);
    if (!passwordValido) return sendUnauthorized(res, 'Credenciales inválidas.');
    
    await usuario.update({ ultimo_login: new Date() });
    const usuarioData = usuario.toJSON();
    delete usuarioData.password;
    const token = jwt.sign(
      { id: usuarioData.id, username: usuarioData.username, rol: usuarioData.rol },
      process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    return sendSuccess(res, { message: 'Login exitoso.', usuario: usuarioData, token });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!usuario) return sendNotFound(res, 'Usuario no encontrado.'); // Raro, pero posible
    return sendSuccess(res, usuario);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors);
  }
  try {
    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario) return sendNotFound(res, 'Usuario no encontrado.');

    const { nombre_completo, email, password } = req.body;
    if (nombre_completo !== undefined) usuario.nombre_completo = nombre_completo;
    if (email) usuario.email = email;
    if (password) usuario.password = password;
    await usuario.save();

    const usuarioActualizado = usuario.toJSON();
    delete usuarioActualizado.password;
    return sendSuccess(res, { message: 'Perfil actualizado.', usuario: usuarioActualizado });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    logger.info(`Usuario ${req.user.username} (ID: ${req.user.id}) cerró sesión.`);
    return sendSuccess(res, { message: 'Sesión cerrada exitosamente.' });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return next(errors);
  }
  try {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'DESC', search } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const queryOptions = {
      attributes: { exclude: ['password'] },
      limit: parseInt(limit, 10),
      offset: offset,
      order: [[sort, order.toUpperCase()]]
    };
    if (search) {
        queryOptions.where = {
            [Op.or]: [
                { username: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { nombre_completo: { [Op.like]: `%${search}%` } }
            ]
        };
    }
    const { count, rows } = await Usuario.findAndCountAll(queryOptions);
    return sendPaginated(res, rows, count, page, limit, 'usuarios');
  } catch (error) {
    next(error);
  }
};