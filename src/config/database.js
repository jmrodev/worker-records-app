import { Sequelize } from 'sequelize'

const sequelize = new Sequelize('control_horario', 'jmro', 'jmro1975', {
  host: 'localhost',
  dialect: 'mysql',
})

export default sequelize
