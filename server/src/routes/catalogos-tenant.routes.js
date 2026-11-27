import { Router } from 'express';
import {
  deleteCuentaBancaria,
  getBancos,
  getCuentaBancaria,
  getCuentasBancarias,
  getEmpresa,
  getEmpresas,
  getPaises,
  patchCuentaBancaria,
  patchEmpresa,
  postCuentaBancaria,
  postEmpresa,
} from '../controllers/catalogos-tenant.controller.js';

const router = Router();

router.get('/paises', getPaises);
router.get('/bancos', getBancos);

router.get('/empresas', getEmpresas);
router.get('/empresas/:id', getEmpresa);
router.post('/empresas', postEmpresa);
router.patch('/empresas/:id', patchEmpresa);

router.get('/cuentas-bancarias', getCuentasBancarias);
router.get('/cuentas-bancarias/:id', getCuentaBancaria);
router.post('/cuentas-bancarias', postCuentaBancaria);
router.patch('/cuentas-bancarias/:id', patchCuentaBancaria);
router.delete('/cuentas-bancarias/:id', deleteCuentaBancaria);

export default router;