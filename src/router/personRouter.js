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
  getPersonByLastName
} from '../controllers/personController.js'

const router = express.Router()

// Rutas RESTful
router.get('/', getAllPersons)
router.get('/:id', getPersonById)
router.post('/', createPerson)
router.get('/nombre/:nombre', getPersonByName)
router.get('/apellido/:apellido', getPersonByLastName)
router.get('/edad/:edad', getPersonByAge)
router.get('/fecha-nacimiento/:fechaNacimiento', getPersonByBirthdate)
router.get('/dni/:dni', getPersonByDni)
router.get('/email/:email', getPersonByEmail)



export default router
