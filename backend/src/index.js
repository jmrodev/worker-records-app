import express from 'express';
import sequelize from './config/database.js';
import indexRouter from './router/indexRouter.js';

const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/', indexRouter); // Cambiado a un endpoint más descriptivo

// Sincronizar la base de datos y levantar el servidor
sequelize.sync({ force: false }) // Cambia a true si necesitas sobrescribir tablas existentes
  .then(() => {
    console.log('Base de datos sincronizada');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al sincronizar la base de datos:', error);
  });

// Manejo de errores globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ocurrió un error en el servidor' });
});
