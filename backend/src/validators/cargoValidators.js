import { body, param, query } from 'express-validator';
import Cargo from '../models/Cargo.js';

export const createCargoValidation = [
  body('nombre').trim().notEmpty().withMessage('Nombre de cargo requerido.').isLength({ max: 100 })
    .custom(async (value) => {
      const cargo = await Cargo.findOne({ where: { nombre: value } });
      if (cargo) return Promise.reject('Ya existe un cargo con ese nombre.');
    }),
  body('tipo').optional({ checkFalsy: true }).trim().isLength({ max: 50 })
];

export const updateCargoValidation = [
  param('id').isUUID(4).withMessage('ID de cargo inválido.'),
  body('nombre').optional().trim().notEmpty().withMessage('Nombre no puede ser vacío.').isLength({ max: 100 })
    .custom(async (value, { req }) => {
      if (value) {
        const cargo = await Cargo.findOne({ where: { nombre: value } });
        if (cargo && cargo.id !== req.params.id) return Promise.reject('Ya existe otro cargo con ese nombre.');
      }
    }),
  body('tipo').optional({ checkFalsy: true }).trim().isLength({ max: 50 })
];

export const cargoIdParamValidation = [
  param('id').isUUID(4).withMessage('ID de cargo inválido.')
];

export const cargoQueryValidation = [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('nombre').optional().isString().trim(),
    query('tipo').optional().isString().trim(),
    query('sort').optional().isString().trim(),
    query('order').optional().isString().toUpperCase().isIn(['ASC', 'DESC']),
];