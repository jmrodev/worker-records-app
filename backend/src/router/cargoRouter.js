import express from 'express'

import {
    createCargo,
    getAllCargos
} from '../controllers/cargoController.js'

const router = express.Router()

// Rutas RESTful
router.get('/', getAllCargos)
router.post('/', createCargo)

export default router

