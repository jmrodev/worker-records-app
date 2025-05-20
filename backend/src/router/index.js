import express from 'express';
import authRouter from './authRouter.js';
import personRouter from './personRouter.js';
import cargoRouter from './cargoRouter.js';
import recordRouter from './recordRouter.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/persons',personRouter);
router.use('/cargos', cargoRouter);
router.use('/records', recordRouter);

export default router;