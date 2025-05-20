import express from 'express';
import {
  createRecord, getAllRecords, getRecordById, updateRecord, deleteRecord // Añadido update y delete
} from '../controllers/recordController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { 
  createRecordValidation, 
  updateRecordValidation, // NUEVO
  recordIdParamValidation,
  recordQueryValidation
} from '../validators/recordValidators.js';

const router = express.Router();

router.use(authenticate); // Todos los endpoints de record requieren autenticación

router.post('/', authorize(['admin', 'supervisor', 'usuario']), createRecordValidation, createRecord);

// Admin/Supervisor pueden ver todos o filtrar. Usuarios podrían tener esta ruta restringida
// o filtrada automáticamente a sus propios registros en el controlador.
router.get('/', authorize(['admin', 'supervisor', 'usuario']), recordQueryValidation, getAllRecords); 

// Admin/Supervisor pueden ver cualquier registro. Usuarios solo los suyos (lógica en controlador).
router.get('/:id', authorize(['admin', 'supervisor', 'usuario']), recordIdParamValidation, getRecordById);

// NUEVAS RUTAS PUT Y DELETE
router.put('/:id', authorize(['admin', 'supervisor']), updateRecordValidation, updateRecord); // Solo admin/supervisor pueden actualizar
router.delete('/:id', authorize(['admin', 'supervisor']), recordIdParamValidation, deleteRecord); // Solo admin/supervisor pueden eliminar

export default router;