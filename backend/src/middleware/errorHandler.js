import logger from '../utils/logger.js';
import { sendError } from '../utils/responseHandler.js'; // Usamos nuestro handler
import { UniqueConstraintError, ValidationError, ForeignKeyConstraintError, DatabaseError } from 'sequelize'; // MODIFICADO: Importar tipos de error específicos

export const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  // Loguear el error con todos sus detalles
  logger.logError(`Error en ${req.method} ${req.originalUrl}`, err);

  // Errores de Sequelize
  if (err instanceof ValidationError) { // MODIFICADO: Usar instanceof
    return sendError(res, {
      message: 'Error de validación de datos.',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message,
        value: e.value
      }))
    }, 400);
  }
  
  if (err instanceof UniqueConstraintError) { // MODIFICADO: Usar instanceof
    return sendError(res, {
      message: 'Violación de restricción única.',
      errors: err.errors.map(e => ({ // MODIFICADO: Devolver todos los errores de constraint
        field: e.path,
        message: e.message, // El mensaje de Sequelize suele ser útil
        value: e.value
      }))
      // detail: `El valor '${err.errors[0].value}' para el campo '${err.errors[0].path}' ya existe.`
    }, 409); // 409 Conflict
  }
  
  if (err instanceof ForeignKeyConstraintError) { // MODIFICADO: Usar instanceof
    return sendError(res, {
      message: 'Error de clave foránea.',
      detail: 'La operación viola una restricción de integridad referencial. Un recurso relacionado no existe o no puede ser eliminado.'
      // field: err.fields ? err.fields.join(', ') : undefined, // Puede ser útil
    }, 400); // O 409 si es más apropiado
  }
  
  if (err instanceof DatabaseError) { // MODIFICADO: Usar instanceof
    // Para errores de base de datos más genéricos (ej. sintaxis SQL, etc.)
    return sendError(res, {
      message: 'Error de base de datos.',
      detail: process.env.NODE_ENV === 'production' 
        ? 'Ocurrió un error durante la operación con la base de datos.' 
        : err.message // Mostrar mensaje original en desarrollo
    }, 500);
  }
  
  // Error de validación de express-validator (si se pasa el objeto de error directamente)
  // El objeto `errors` de validationResult tiene un método `array()`
  if (err.errors && typeof err.array === 'function') { // MODIFICADO: Chequeo más específico para el objeto de express-validator
    return sendError(res, {
      message: 'Error de validación de la solicitud.',
      errors: err.array() // err.array() devuelve los errores formateados
    }, 400);
  }
  
  // Errores JWT (ya manejados en authMiddleware, pero por si acaso)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return sendError(res, {
      message: err.name === 'TokenExpiredError' ? 'Token expirado.' : 'Token inválido.',
      detail: 'La autenticación ha fallado.'
    }, 401);
  }

  // Errores con statusCode definido (custom errors)
  if (err.statusCode) {
    return sendError(res, { message: err.message, ...(err.details && {details: err.details}) }, err.statusCode);
  }
  
  // Error genérico
  return sendError(res, {
    message: 'Error interno del servidor.',
    detail: process.env.NODE_ENV === 'production' ? undefined : err.stack // Stack solo en desarrollo
  }, 500);
};