import { body, param, query } from 'express-validator';
import Cargo from '../models/Cargo.js';
import Persona from '../models/Persona.js';

export const createPersonValidation = [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido.').isLength({ max: 100 }),
  body('apellido').trim().notEmpty().withMessage('El apellido es requerido.').isLength({ max: 100 }),
  body('dni').trim().notEmpty().withMessage('El DNI es requerido.').isLength({ max: 20 })
    .custom(async (value) => {
      const persona = await Persona.findOne({ where: { dni: value } });
      if (persona) return Promise.reject('El DNI ya está registrado.');
    }),
  body('email').optional({ checkFalsy: true }).trim().isEmail().withMessage('Email inválido.')
    .isLength({ max: 100 })
    .custom(async (value) => {
      if (value) {
        const persona = await Persona.findOne({ where: { email: value } });
        if (persona) return Promise.reject('El email ya está registrado para otra persona.');
      }
    }),
  body('celular').optional({ checkFalsy: true }).trim().isLength({ max: 50 }),
  body('fecha_nac').optional({ checkFalsy: true }).isISO8601().toDate().withMessage('Fecha de nacimiento inválida.'),
  body('direccion').optional({ checkFalsy: true }).trim().isLength({ max: 255 }),
  body('legajo').optional({ checkFalsy: true }).trim().isLength({ max: 50 })
    .custom(async (value) => {
      if (value) {
        const persona = await Persona.findOne({ where: { legajo: value } });
        if (persona) return Promise.reject('El legajo ya está registrado.');
      }
    }),
  body('cargo_id').optional({ checkFalsy: true }).isUUID(4).withMessage('ID de cargo inválido.')
    .custom(async (value) => {
      if (value) {
        const cargo = await Cargo.findByPk(value);
        if (!cargo) return Promise.reject('El cargo especificado no existe.');
      }
    })
];

export const updatePersonValidation = [
  param('id').isUUID(4).withMessage('ID de persona inválido.'),
  body('nombre').optional().trim().notEmpty().withMessage('Nombre no puede ser vacío.').isLength({ max: 100 }),
  body('apellido').optional().trim().notEmpty().withMessage('Apellido no puede ser vacío.').isLength({ max: 100 }),
  body('dni').optional().trim().notEmpty().withMessage('DNI no puede ser vacío.').isLength({ max: 20 })
    .custom(async (value, { req }) => {
      if (value) {
        const persona = await Persona.findOne({ where: { dni: value } });
        if (persona && persona.id !== req.params.id) return Promise.reject('El DNI ya está registrado.');
      }
    }),
  body('email').optional({ checkFalsy: true }).trim().isEmail().withMessage('Email inválido.')
    .isLength({ max: 100 })
    .custom(async (value, { req }) => {
      if (value) {
        const persona = await Persona.findOne({ where: { email: value } });
        if (persona && persona.id !== req.params.id) return Promise.reject('Email ya registrado.');
      }
    }),
  body('cargo_id').optional({ checkFalsy: true }) // Permite null para desasignar
    .custom(async (value) => { // No usar isUUID si se permite null
        if (value === null) return true; // Permitir null explícitamente
        if (typeof value === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value)) {
            const cargo = await Cargo.findByPk(value);
            if (!cargo) return Promise.reject('El cargo especificado no existe.');
        } else if (value !== undefined && value !== null) { // Solo rechazar si no es UUID y no es null
             return Promise.reject('ID de cargo debe ser un UUID v4 válido o null.');
        }
    }),
  body('legajo').optional({ checkFalsy: true }).trim().isLength({ max: 50 })
    .custom(async (value, { req }) => {
      if (value) {
        const persona = await Persona.findOne({ where: { legajo: value } });
        if (persona && persona.id !== req.params.id) return Promise.reject('Legajo ya registrado.');
      }
    }),
  // ... (otros campos actualizables: celular, fecha_nac, direccion)
];

export const personIdParamValidation = [
  param('id').isUUID(4).withMessage('El ID debe ser un UUID v4 válido.')
];

export const personQueryValidation = [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('nombre').optional().isString().trim(),
    query('apellido').optional().isString().trim(),
    query('dni').optional().isString().trim(),
    query('email').optional().isEmail().normalizeEmail(),
    query('cargo_id').optional().isUUID(4),
    query('tipo_cargo').optional().isString().trim(),
    query('sort').optional().isString().trim(),
    query('order').optional().isString().toUpperCase().isIn(['ASC', 'DESC']),
];