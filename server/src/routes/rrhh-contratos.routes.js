import { Router } from 'express';
import {
  getPersonas,
  postPersona,
} from '../controllers/rrhh-contratos.controller.js';

const router = Router();

router.get('/personas', getPersonas);
router.post('/personas', postPersona);

export default router;