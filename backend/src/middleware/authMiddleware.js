import jwt from 'jsonwebtoken';
import { sendUnauthorized, sendForbidden } from '../utils/responseHandler.js'; // MODIFICADO
import logger from '../utils/logger.js';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) { // MODIFICADO: Chequeo más robusto
      logger.warn('Intento de acceso sin token o con formato incorrecto.');
      return sendUnauthorized(res, 'Se requiere token de autenticación en formato Bearer.');
    }
    
    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contiene id, username, rol
    
    next();
  } catch (error) {
    logger.error('Error de autenticación de token:', error);
    if (error.name === 'TokenExpiredError') {
      return sendUnauthorized(res, 'El token ha expirado.');
    }
    if (error.name === 'JsonWebTokenError') {
      return sendUnauthorized(res, 'Token inválido.');
    }
    // Para otros errores, dejar que el errorHandler general lo capture
    // o manejarlo más específicamente si es necesario.
    return sendUnauthorized(res, 'Fallo en la autenticación del token.');
  }
};

export const authorize = (allowedRoles = []) => { // MODIFICADO: renombrado a allowedRoles para claridad
  return (req, res, next) => {
    if (!req.user || !req.user.rol) { // MODIFICADO: Verificar req.user.rol
      // Esto no debería pasar si 'authenticate' se ejecuta antes
      logger.error('Intento de autorización sin usuario autenticado o sin rol.');
      return sendUnauthorized(res, 'Usuario no autenticado o rol no definido.');
    }
    
    const userRol = req.user.rol; // MODIFICADO: Usar req.user.rol directamente

    // Si allowedRoles está vacío, significa que solo se requiere autenticación.
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRol)) {
      logger.warn(`Usuario ${req.user.username} (rol: ${userRol}) intentó acceder a recurso protegido para roles: ${allowedRoles.join(', ')}`);
      return sendForbidden(res, 'No tiene permisos suficientes para realizar esta acción.');
    }
    
    next();
  };
};