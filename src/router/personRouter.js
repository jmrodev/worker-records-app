import express from 'express'
import {
  createPerson,
  getAllPersons,
  getPersonById,
  getPersonByAge,
  getPersonByBirthdate,
  getPersonByDni,
  getPersonByEmail,
  getPersonByName,
  getPersonByLastName,
  getPersonsByCargo,
  getPersonsByCargoType,
  getPersonsByCargoAndType,
} from '../controllers/personController.js'

const router = express.Router()

// Rutas RESTful
router.get('/', getAllPersons)
router.get('/:id', getPersonById)
router.post('/', createPerson)
router.get('/nombre/:nombre', getPersonByName)
router.get('/apellido/:apellido', getPersonByLastName)
router.get('/edad/:edad', getPersonByAge)
router.get('/fecha-nacimiento/:fecha_nac', getPersonByBirthdate)
router.get('/dni/:dni', getPersonByDni)
router.get('/email/:email', getPersonByEmail)

// Filtrar por cargo
router.get('/cargo/:cargo_id', getPersonsByCargo)

// Filtrar por tipo de cargo
router.get('/tipo/:tipo', getPersonsByCargoType)

// Filtrar por cargo y tipo
router.get('/cargo/:cargo_id/tipo/:tipo', getPersonsByCargoAndType)

export default router
