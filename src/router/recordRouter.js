import express from 'express'
import {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
} from '../controllers/testController.js'
// } from '../controllers/recordController.js'

const router = express.Router()

// Rutas RESTful
router.get('/', getAllRecords)
router.get('/:id', getRecordById)
router.post('/', createRecord)
router.put('/:id', updateRecord)
router.delete('/:id', deleteRecord)

export default router
