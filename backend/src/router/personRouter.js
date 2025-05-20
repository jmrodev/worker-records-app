import express from 'express';
import {
  createPerson, getAllPersons, getPersonById, updatePerson, deletePerson,
  getPersonByDni, getPersonByName, getPersonByLastName, getPersonByBirthdate, getPersonByAge, getPersonByEmail
} from '../controllers/personController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import {
  createPersonValidation, updatePersonValidation, personIdParamValidation, personQueryValidation
} from '../validators/personValidators.js';
import { param } from 'express-validator';

const router = express.Router();

// Aplicar autenticación a todas las rutas de personas
router.use(authenticate); 

router.post('/', authorize(['admin', 'supervisor']), createPersonValidation, createPerson);
router.get('/', personQueryValidation, getAllPersons); // Todos los autenticados pueden ver

router.get('/:id', personIdParamValidation, getPersonById); // Todos los autenticados pueden ver por ID
router.put('/:id', authorize(['admin', 'supervisor']), updatePersonValidation, updatePerson);
router.delete('/:id', authorize(['admin']), personIdParamValidation, deletePerson);

// Rutas de búsqueda específicas (considerar si son necesarias o si se usa getAllPersons con filtros)
router.get('/dni/:dni', [param('dni').notEmpty().isString()], getPersonByDni);
router.get('/nombre/:nombre', [param('nombre').notEmpty().isString()], getPersonByName);
router.get('/apellido/:apellido', [param('apellido').notEmpty().isString()], getPersonByLastName);
router.get('/edad/:edad', [param('edad').isInt({ min:0 })], getPersonByAge);
router.get('/fecha-nacimiento/:fecha_nac', [param('fecha_nac').isISO8601().toDate()], getPersonByBirthdate);
router.get('/email/:email', [param('email').isEmail()], getPersonByEmail);

export default router;