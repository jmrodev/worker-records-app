import express from 'express';
import {
    createCargo, getAllCargos, getCargoById, updateCargo, deleteCargo
} from '../controllers/cargoController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { 
    createCargoValidation, updateCargoValidation, cargoIdParamValidation, cargoQueryValidation
} from '../validators/cargoValidators.js';

const router = express.Router();

router.use(authenticate); 
router.use(authorize(['admin', 'supervisor'])); // Solo admin y supervisor pueden gestionar cargos

router.post('/', createCargoValidation, createCargo);
router.get('/', cargoQueryValidation, getAllCargos);
router.get('/:id', cargoIdParamValidation, getCargoById);
router.put('/:id', updateCargoValidation, updateCargo);
router.delete('/:id', cargoIdParamValidation, deleteCargo);

export default router;