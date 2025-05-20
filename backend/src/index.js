import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import sequelize, { connectDB } from './config/database.js';
import mainRouter from './router/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use((req, res, next) => {
  logger.http(`Petición: ${req.method} ${req.originalUrl}`, { ip: req.ip });
  next();
});

app.use('/api/v1', mainRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

app.use((req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync({ force: process.env.DB_FORCE_SYNC === 'true' });
    logger.info(`Base de datos sincronizada. force: ${process.env.DB_FORCE_SYNC === 'true'}`);
    app.listen(PORT, () => {
      logger.info(`Servidor en http://localhost:${PORT} modo ${process.env.NODE_ENV || 'dev'}`);
      logger.info(`API en http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    logger.error('Error fatal al iniciar la aplicación:', error);
    process.exit(1);
  }
};

const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
signals.forEach(signal => {
  process.on(signal, async () => {
    logger.info(`\nRecibida señal ${signal}. Cerrando servidor...`);
    try {
      // Aquí iría server.close() si guardas la instancia de app.listen()
      await sequelize.close();
      logger.info('Conexión a la base de datos cerrada.');
      process.exit(0);
    } catch (err) {
      logger.error('Error durante el cierre:', err);
      process.exit(1);
    }
  });
});

process.on('uncaughtException', (error) => {
  logger.error('Excepción no capturada:', error);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Rechazo de promesa no manejado:', { reason });
  process.exit(1);
});

startServer();