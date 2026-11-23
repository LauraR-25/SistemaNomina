import { Router } from 'express';
import {
  getConceptos,
  postConcepto,
} from '../controllers/conceptos-novedades-ley.controller.js';

const router = Router();

router.get('/conceptos', getConceptos);
router.post('/conceptos', postConcepto);

export default router;