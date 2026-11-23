import { Router } from 'express';
import authRbacRoutes from './auth-rbac.routes.js';
import catalogosTenantRoutes from './catalogos-tenant.routes.js';
import conceptosNovedadesLeyRoutes from './conceptos-novedades-ley.routes.js';
import nominaRecibosRoutes from './nomina-recibos.routes.js';
import prestamosRoutes from './prestamos.routes.js';
import rrhhContratosRoutes from './rrhh-contratos.routes.js';

const router = Router();

router.use('/auth', authRbacRoutes);
router.use('/catalogos', catalogosTenantRoutes);
router.use('/conceptos', conceptosNovedadesLeyRoutes);
router.use('/nomina', nominaRecibosRoutes);
router.use('/prestamos', prestamosRoutes);
router.use('/rrhh', rrhhContratosRoutes);

export default router;