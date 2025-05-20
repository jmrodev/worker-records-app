import { body, param, query } from 'express-validator';
import Persona from '../models/Persona.js';

export const createRecordValidation = [
  body('persona_id').notEmpty().withMessage('ID de persona requerido.').isUUID(4).withMessage('ID de persona inválido.')
    .custom(async (value) => {
      const persona = await Persona.findByPk(value);
      if (!persona) return Promise.reject('La persona especificada no existe.');
    }),
  body('tipo').notEmpty().withMessage('Tipo de registro requerido.').isIn(['ingreso', 'egreso']).withMessage("Tipo inválido."),
  body('fecha_hora').optional().isISO8601().toDate().withMessage('Fecha y hora inválidas.')
];

// NUEVO: Validador para actualizar registro
export const updateRecordValidation = [
  param('id').isUUID(4).withMessage('ID de registro inválido.'),
  // Solo permitir actualizar tipo y fecha_hora, persona_id no debería cambiar en un registro existente.
  body('tipo').optional().isIn(['ingreso', 'egreso']).withMessage("Tipo inválido si se proporciona."),
  body('fecha_hora').optional().isISO8601().toDate().withMessage('Fecha y hora inválidas si se proporcionan.')
];

export const recordIdParamValidation = [
  param('id').isUUID(4).withMessage('ID de registro inválido.')
];

export const recordQueryValidation = [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('persona_id').optional().isUUID(4),
    query('tipo').optional().isIn(['ingreso', 'egreso']),
    query('fecha_desde').optional().isISO8601().toDate(),
    query('fecha_hasta').optional().isISO8601().toDate(),
    query('sort').optional().isString().trim(),
    query('order').optional().isString().toUpperCase().isIn(['ASC', 'DESC']),
];