import { Router } from 'express';
import { getPeriodosNomina } from '../controllers/nomina-recibos.controller.js';

const router = Router();

router.get('/periodos', getPeriodosNomina);

export default router;