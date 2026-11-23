import { Router } from 'express';
import {
  getPaises,
  getBancos,
  getEmpresas,
  postEmpresa,
} from '../controllers/catalogos-tenant.controller.js';

const router = Router();

router.get('/paises', getPaises);
router.get('/bancos', getBancos);
router.get('/empresas', getEmpresas);
router.post('/empresas', postEmpresa);

export default router;