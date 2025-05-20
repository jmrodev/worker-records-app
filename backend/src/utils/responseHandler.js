/**
 * Utilidades para estandarizar las respuestas HTTP
 */

export const sendSuccess = (res, data, statusCode = 200) => {
  if (statusCode === 204) {
    return res.status(statusCode).send(); // No body for 204
  }
  return res.status(statusCode).json(data);
};

export const sendError = (res, errorPayload, statusCode = 500) => {
  // Si errorPayload es un string, lo convertimos a un objeto error estándar
  // Si ya es un objeto (ej. de express-validator), lo usamos tal cual
  const body = typeof errorPayload === 'string' ? { message: errorPayload } : errorPayload;
  
  // Asegurarnos de que siempre haya un campo 'error' o 'message' en el nivel superior
  // y que el statusCode sea consistente con errores cliente/servidor
  const responseBody = {
    status: 'error', // MODIFICADO: añadir un campo de estado
    ...(body.message ? { message: body.message } : {}),
    ...(body.errors ? { errors: body.errors } : {}), // Para errores de validación
    ...(body.details ? { details: body.details } : {}), // Para otros detalles
    ...(body.field && body.value ? { field: body.field, value: body.value } : {}) // Para unique constraint
  };

  // Si no hay message pero hay errors (de express-validator), tomar el primer mensaje
  if (!responseBody.message && responseBody.errors && responseBody.errors.length > 0) {
    responseBody.message = responseBody.errors[0].msg || 'Error de validación';
  } else if (!responseBody.message) {
    responseBody.message = 'Ocurrió un error.'; // Mensaje genérico si no hay nada más
  }


  return res.status(statusCode).json(responseBody);
};

export const sendNotFound = (res, message = 'Recurso no encontrado') => {
  return sendError(res, { message }, 404);
};

export const sendBadRequest = (res, errorData = 'Solicitud incorrecta') => {
  // errorData puede ser un string o un objeto { message: '...', errors: [] }
  return sendError(res, errorData, 400);
};

export const sendUnauthorized = (res, message = 'No autorizado') => {
  return sendError(res, { message }, 401);
};

export const sendForbidden = (res, message = 'Acceso denegado') => {
  return sendError(res, { message }, 403);
};

export const sendConflict = (res, message = 'Conflicto con el recurso') => {
  return sendError(res, { message }, 409);
};

export const sendCreated = (res, data) => {
  return sendSuccess(res, data, 201);
};

export const sendNoContent = (res) => {
  return sendSuccess(res, null, 204); // sendSuccess ya maneja esto
};

export const sendPaginated = (res, rows, count, page, limit, resourceName = 'data') => {
  const totalItems = parseInt(count, 10);
  const currentPage = parseInt(page, 10);
  const itemsPerPage = parseInt(limit, 10);
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 0; // MODIFICADO: Manejar count 0

  return sendSuccess(res, {
    status: 'success', // MODIFICADO: añadir un campo de estado
    totalItems,
    totalPages,
    currentPage,
    itemsPerPage,
    [resourceName]: rows // Nombre del recurso configurable
  });
};