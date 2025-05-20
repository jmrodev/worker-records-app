import express from 'express';
import { 
  register, login, getProfile, updateProfile, logout, getAllUsers 
} from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { 
  registerValidation, loginValidation, updateProfileValidation 
} from '../validators/authValidators.js';
import { query } from 'express-validator';

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfileValidation, updateProfile);
router.post('/logout', authenticate, logout);

router.get(
  '/users', 
  authenticate, authorize(['admin']), 
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('sort').optional().isString().isIn(['username', 'email', 'nombre_completo', 'rol', 'createdAt', 'ultimo_login']),
    query('order').optional().isString().toUpperCase().isIn(['ASC', 'DESC']),
    query('search').optional().isString().trim()
  ],
  getAllUsers
);

export default router;