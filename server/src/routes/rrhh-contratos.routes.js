import { Router } from 'express';
import { deleteCargo, getCargo, getCargos, patchCargo, postCargo } from '../controllers/cargos.controller.js';
import { getContrato, getContratos, getHistorialSalarios, patchContrato, patchEstadoContrato, postCambioSalario, postContrato } from '../controllers/contratos.controller.js';
import { deletePersona, getPersona, getPersonas, patchPersona, postPersona } from '../controllers/rrhh-contratos.controller.js';

const router = Router();

router.get('/personas', getPersonas);
router.get('/personas/:id', getPersona);
router.post('/personas', postPersona);
router.patch('/personas/:id', patchPersona);
router.delete('/personas/:id', deletePersona);

router.get('/cargos', getCargos);
router.get('/cargos/:id', getCargo);
router.post('/cargos', postCargo);
router.patch('/cargos/:id', patchCargo);
router.delete('/cargos/:id', deleteCargo);

router.get('/contratos', getContratos);
router.get('/contratos/:id', getContrato);
router.post('/contratos', postContrato);
router.patch('/contratos/:id', patchContrato);
router.patch('/contratos/:id/estado', patchEstadoContrato);
router.get('/contratos/:id/salarios', getHistorialSalarios);
router.post('/contratos/:id/salarios', postCambioSalario);

export default router;
