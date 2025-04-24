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
  deletePerson
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
router.get('/cargo/:cargo_id', getPersonsByCargo)
router.get('/tipo/:tipo', getPersonsByCargoType)
router.get('/cargo/:cargo_id/tipo/:tipo', getPersonsByCargoAndType)
router.delete('/:id', deletePerson)

export default router
