import { body } from 'express-validator';
import Usuario from '../models/Usuario.js';

export const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 }).withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres.')
    .isAlphanumeric().withMessage('El nombre de usuario solo puede contener letras y números.')
    .custom(async (value) => {
      const user = await Usuario.findOne({ where: { username: value } });
      if (user) return Promise.reject('El nombre de usuario ya está en uso.');
    }),
  body('email')
    .trim()
    .isEmail().withMessage('Debe proporcionar un email válido.')
    .normalizeEmail()
    .custom(async (value) => {
      const user = await Usuario.findOne({ where: { email: value } });
      if (user) return Promise.reject('El email ya está registrado.');
    }),
  body('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
  body('nombre_completo')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('El nombre completo no debe exceder los 100 caracteres.'),
  body('rol')
    .optional()
    .isIn(['admin', 'supervisor', 'usuario']).withMessage("Rol no válido.")
];

export const loginValidation = [
  body('username').notEmpty().withMessage('El nombre de usuario o email es requerido.').trim(),
  body('password').notEmpty().withMessage('La contraseña es requerida.')
];

export const updateProfileValidation = [
  body('nombre_completo')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('El nombre completo debe tener entre 1 y 100 caracteres si se proporciona.'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Debe proporcionar un email válido si desea actualizarlo.')
    .normalizeEmail()
    .custom(async (value, { req }) => {
      if (value) {
        const user = await Usuario.findOne({ where: { email: value } });
        if (user && user.id !== req.user.id) {
          return Promise.reject('El email ya está registrado por otro usuario.');
        }
      }
    }),
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres si se proporciona.')
];