import { Op } from 'sequelize';
import RegistroHorario from '../models/RegistroHorario.js';
import Persona from '../models/Persona.js';
import {
  sendSuccess,
  sendNotFound,
  sendCreated,
  sendNoContent, // NUEVO
  sendPaginated
} from '../utils/responseHandler.js';
import { validationResult } from 'express-validator';

export const createRecord = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errors);
  try {
    const { persona_id, tipo, fecha_hora } = req.body;
    // Opcional: verificar que el usuario que crea el registro es la misma persona_id
    // o un admin/supervisor, si esa es la lógica de negocio.
    // if (req.user.rol !== 'admin' && req.user.rol !== 'supervisor' && req.user.id !== persona_id (si Usuario.id es Persona.id)) {
    //   return sendForbidden(res, 'No tiene permisos para crear registros para esta persona.');
    // }
    const nuevoRegistro = await RegistroHorario.create({ persona_id, tipo, fecha_hora });
    const registroConPersona = await RegistroHorario.findByPk(nuevoRegistro.id, {
        include: [{ model: Persona, as: 'persona', attributes: ['id', 'nombre', 'apellido', 'dni'] }]
    });
    return sendCreated(res, registroConPersona || nuevoRegistro);
  } catch (error) {
    next(error);
  }
};

export const getAllRecords = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errors);
  try {
    const { page = 1, limit = 10, persona_id, tipo, fecha_desde, fecha_hasta, sort = 'fecha_hora', order = 'DESC' } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const whereClause = {};
    if (persona_id) whereClause.persona_id = persona_id;
    if (tipo) whereClause.tipo = tipo;
    if (fecha_desde && fecha_hasta) {
      whereClause.fecha_hora = { [Op.between]: [new Date(fecha_desde), new Date(fecha_hasta)] };
    } else if (fecha_desde) {
      whereClause.fecha_hora = { [Op.gte]: new Date(fecha_desde) };
    } else if (fecha_hasta) {
      whereClause.fecha_hora = { [Op.lte]: new Date(fecha_hasta) };
    }

    // Lógica para restringir a usuarios ver solo sus propios registros
    // if (req.user.rol === 'usuario') {
    //   // Asumir que req.user.id (del token JWT) es el persona_id o hay una forma de mapearlo
    //   // Esto requiere que el modelo Usuario tenga una relación directa o indirecta con Persona.id
    //   // Por ahora, este ejemplo asume que un admin/supervisor puede ver todo.
    //   // whereClause.persona_id = req.user.persona_id_correspondiente; // Necesitarías este mapeo
    // }


    const { count, rows } = await RegistroHorario.findAndCountAll({
      where: whereClause,
      include: { model: Persona, as: 'persona', attributes: ['id', 'nombre', 'apellido', 'dni'] },
      limit: parseInt(limit, 10),
      offset: offset,
      order: [[sort, order.toUpperCase()]]
    });
    return sendPaginated(res, rows, count, page, limit, 'registros');
  } catch (error) {
    next(error);
  }
};

export const getRecordById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errors);
  try {
    const { id } = req.params;
    const registro = await RegistroHorario.findByPk(id, {
      include: { model: Persona, as: 'persona', attributes: ['id', 'nombre', 'apellido', 'dni'] }
    });
    if (!registro) return sendNotFound(res, 'Registro no encontrado.');
    
    // Opcional: Verificar si el usuario tiene permiso para ver este registro específico
    // if (req.user.rol === 'usuario' && registro.persona_id !== req.user.persona_id_correspondiente) {
    //    return sendForbidden(res, 'No tiene permiso para ver este registro.');
    // }
    return sendSuccess(res, registro);
  } catch (error) {
    next(error);
  }
};

// NUEVO: Actualizar un registro
export const updateRecord = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errors);
  try {
    const { id } = req.params;
    const registro = await RegistroHorario.findByPk(id);
    if (!registro) return sendNotFound(res, 'Registro no encontrado.');

    // Opcional: Verificar permisos para actualizar
    // if (req.user.rol === 'usuario' && registro.persona_id !== req.user.persona_id_correspondiente) {
    //    return sendForbidden(res, 'No tiene permiso para actualizar este registro.');
    // }

    const { tipo, fecha_hora } = req.body;
    // No permitir cambiar persona_id
    await registro.update({ 
        ...(tipo && { tipo }), 
        ...(fecha_hora && { fecha_hora }) 
    });
    
    const registroActualizado = await RegistroHorario.findByPk(id, {
        include: [{ model: Persona, as: 'persona', attributes: ['id', 'nombre', 'apellido', 'dni'] }]
    });
    return sendSuccess(res, registroActualizado);
  } catch (error) {
    next(error);
  }
};

// NUEVO: Eliminar un registro
export const deleteRecord = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errors);
  try {
    const { id } = req.params;
    const registro = await RegistroHorario.findByPk(id);
    if (!registro) return sendNotFound(res, 'Registro no encontrado.');

    // Opcional: Verificar permisos para eliminar
    // if (req.user.rol === 'usuario' && registro.persona_id !== req.user.persona_id_correspondiente) {
    //    return sendForbidden(res, 'No tiene permiso para eliminar este registro.');
    // }

    await registro.destroy();
    return sendNoContent(res);
  } catch (error) {
    next(error);
  }
};