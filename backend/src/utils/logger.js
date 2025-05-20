import winston from 'winston';
import dotenv from 'dotenv';
import fs from 'fs'; // NUEVO: Para crear el directorio de logs
import path from 'path'; // NUEVO: Para construir la ruta del directorio de logs

dotenv.config();

// NUEVO: Asegurar que el directorio de logs exista
const logsDir = 'logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFormat = winston.format.printf(({ level, message, timestamp, stack, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (stack) {
    msg += `\n${stack}`; // MODIFICADO: Mejor formato para stack
  }
  // Evitar loguear metadata vacía o el propio 'error' que ya está en stack/message
  const metaToLog = { ...metadata };
  delete metaToLog.error; // El objeto error ya está expandido

  if (Object.keys(metaToLog).length > 0 && Object.values(metaToLog).some(v => v !== undefined)) {
    // msg += ` ${JSON.stringify(metaToLog, null, 2)}`; // Más legible
    msg += ` ${JSON.stringify(metaToLog)}`;
  }
  return msg;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }), // Importante para capturar el stack
    winston.format.splat(),
    winston.format.json() // Formato JSON para archivos
  ),
  defaultMeta: { service: process.env.SERVICE_NAME || 'control-horario-api' },
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'), // MODIFICADO: path.join
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: winston.format.combine( // MODIFICADO: Usar JSON para archivos
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.json()
      )
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'), // MODIFICADO: path.join
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: winston.format.combine( // MODIFICADO: Usar JSON para archivos
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.json()
      )
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.errors({ stack: true }), // Para que el stack se muestre en consola
      logFormat // Usar el formato personalizado para la consola
    )
  }));
}

// Método mejorado para registrar errores
logger.logError = (message, errorObject) => {
  if (errorObject instanceof Error) {
    logger.error(message, { 
      message: errorObject.message, // Redundante si error.message ya está en el error principal
      stack: errorObject.stack, 
      // name: errorObject.name, // Podrías incluir más propiedades del error
      ...errorObject // Incluir otras propiedades custom del error
    });
  } else {
    logger.error(message, { details: errorObject }); // Si no es un objeto Error
  }
};


export default logger;