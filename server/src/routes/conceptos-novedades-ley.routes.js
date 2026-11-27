import { Router } from 'express';
import {
  deleteAsignacion,
  deleteConcepto,
  getAsignacion,
  getAsignaciones,
  getConcepto,
  getConceptos,
  patchAsignacion,
  patchConcepto,
  patchDesactivarConcepto,
  patchTerminarAsignacion,
  postAsignacion,
  postConcepto,
} from '../controllers/conceptos-novedades-ley.controller.js';

const router = Router();

router.get('/conceptos/asignaciones', getAsignaciones);
router.get('/conceptos/asignaciones/:id', getAsignacion);
router.post('/conceptos/asignaciones', postAsignacion);
router.patch('/conceptos/asignaciones/:id', patchAsignacion);
router.patch('/conceptos/asignaciones/:id/terminar', patchTerminarAsignacion);
router.delete('/conceptos/asignaciones/:id', deleteAsignacion);

router.get('/conceptos', getConceptos);
router.post('/conceptos', postConcepto);
router.get('/conceptos/:id', getConcepto);
router.patch('/conceptos/:id', patchConcepto);
router.patch('/conceptos/:id/desactivar', patchDesactivarConcepto);
router.delete('/conceptos/:id', deleteConcepto);

export default router;
