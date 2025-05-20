import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
import logger from '../utils/logger.js'

dotenv.config()

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false, // MODIFICADO: Usar logger.debug para Sequelize
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  }
)

export const connectDB = async () => {
  try {
    await sequelize.authenticate()
    logger.info('Conexión a la base de datos establecida exitosamente.')
  } catch (error) {
    logger.error('No se pudo conectar a la base de datos:', error)
    process.exit(1)
  }
}

export default sequelize