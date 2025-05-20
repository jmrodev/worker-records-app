import { Op } from 'sequelize';
import Cargo from '../models/Cargo.js';
import Persona from '../models/Persona.js'; // Para verificar si el cargo está en uso
import {
  sendSuccess,
  sendNotFound,
  sendCreated,
  sendNoContent,
  sendPaginated,
  sendConflict
} from '../utils/responseHandler.js';
import { validationResult } from 'express-validator';

export const createCargo = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errors);
  try {
    const { nombre, tipo } = req.body;
    const nuevoCargo = await Cargo.create({ nombre, tipo });
    return sendCreated(res, nuevoCargo);
  } catch (error) {
    next(error);
  }
};

export const getAllCargos = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errors);
  try {
    const { page = 1, limit = 10, nombre, tipo, sort = 'nombre', order = 'ASC' } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const whereClause = {};
    if (nombre) whereClause.nombre = { [Op.like]: `%${nombre}%` };
    if (tipo) whereClause.tipo = { [Op.like]: `%${tipo}%` };

    const { count, rows } = await Cargo.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit, 10),
        offset: offset,
        order: [[sort, order.toUpperCase()]]
    });
    return sendPaginated(res, rows, count, page, limit, 'cargos');
  } catch (error) {
    next(error);
  }
};

export const getCargoById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errors);
  try {
    const { id } = req.params;
    const cargo = await Cargo.findByPk(id);
    if (!cargo) return sendNotFound(res, 'Cargo no encontrado.');
    return sendSuccess(res, cargo);
  } catch (error) {
    next(error);
  }
};

export const updateCargo = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errors);
  try {
    const { id } = req.params;
    const cargo = await Cargo.findByPk(id);
    if (!cargo) return sendNotFound(res, 'Cargo no encontrado.');
    
    const { nombre, tipo } = req.body;
    await cargo.update({ nombre, tipo }); // Solo actualiza los campos provistos
    return sendSuccess(res, cargo);
  } catch (error) {
    next(error);
  }
};

export const deleteCargo = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errors);
  try {
    const { id } = req.params;
    const cargo = await Cargo.findByPk(id);
    if (!cargo) return sendNotFound(res, 'Cargo no encontrado.');

    // Verificar si el cargo está en uso (ON DELETE SET NULL lo maneja en DB, pero es bueno informar)
    const personasConCargo = await Persona.count({ where: { cargo_id: id } });
    if (personasConCargo > 0) {
      return sendConflict(res, 
        `El cargo está asignado a ${personasConCargo} persona(s). Si se elimina, estas personas quedarán sin cargo asignado.`
      );
      // O si prefieres prohibir la eliminación:
      // return sendConflict(res, 'El cargo está asignado y no puede ser eliminado. Primero desasígnelo de todas las personas.');
    }

    await cargo.destroy();
    return sendNoContent(res);
  } catch (error) {
    next(error);
  }
};