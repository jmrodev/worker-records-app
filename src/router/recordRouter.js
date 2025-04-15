import express from 'express'
import {
  getAllRecords,
  getRecordById,
  createRecord,
} from '../controllers/recordController.js'

const router = express.Router()

// Rutas RESTful
router.get('/', getAllRecords)
router.get('/:id', getRecordById)
router.post('/', createRecord)

export default router
