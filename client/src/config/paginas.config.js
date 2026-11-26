import { PermisosPage } from '../pages/auth-rbac/PermisosPage.jsx';
import { PerfilesPage } from '../pages/auth-rbac/PerfilesPage.jsx';
import { UsuariosPage } from '../pages/auth-rbac/UsuariosPage.jsx';
import { BancosPage } from '../pages/catalogos-tenant/BancosPage.jsx';
import { CuentasBancariasPage } from '../pages/catalogos-tenant/CuentasBancariasPage.jsx';
import { EmpresasPage } from '../pages/catalogos-tenant/EmpresasPage.jsx';
import { AportesLeyPage } from '../pages/conceptos-novedades-ley/AportesLeyPage.jsx';
import { ConceptosPage } from '../pages/conceptos-novedades-ley/ConceptosPage.jsx';
import { NovedadesPage } from '../pages/conceptos-novedades-ley/NovedadesPage.jsx';
import { RegistroHorasPage } from '../pages/conceptos-novedades-ley/RegistroHorasPage.jsx';
import { DashboardPage } from '../pages/dashboard/DashboardPage.jsx';
import { PeriodosPage } from '../pages/nomina-recibos/PeriodosPage.jsx';
import { PrenominaPage } from '../pages/nomina-recibos/PrenominaPage.jsx';
import { RecibosPage } from '../pages/nomina-recibos/RecibosPage.jsx';
import { CuotasPrestamoPage } from '../pages/prestamos/CuotasPrestamoPage.jsx';
import { PrestamosPage } from '../pages/prestamos/PrestamosPage.jsx';
import { CargosPage } from '../pages/rrhh-contratos/CargosPage.jsx';
import { ContratosPage } from '../pages/rrhh-contratos/ContratosPage.jsx';
import { PersonasPage } from '../pages/rrhh-contratos/PersonasPage.jsx';
import { AccesoDenegadoPage } from '../pages/system/AccesoDenegadoPage.jsx';

export const REGISTRO_PAGINAS = {
  '/inicio|': DashboardPage,
  '/acceso-denegado|': AccesoDenegadoPage,
  '/catalogos|empresas': EmpresasPage,
  '/catalogos|bancos': BancosPage,
  '/catalogos|cuentas-bancarias': CuentasBancariasPage,
  '/conceptos|conceptos': ConceptosPage,
  '/conceptos|novedades': NovedadesPage,
  '/conceptos|registro-horas': RegistroHorasPage,
  '/conceptos|aportes-ley': AportesLeyPage,
  '/nomina|periodos': PeriodosPage,
  '/nomina|prenomina': PrenominaPage,
  '/nomina|recibos': RecibosPage,
  '/prestamos|prestamos': PrestamosPage,
  '/prestamos|cuotas': CuotasPrestamoPage,
  '/rrhh|personas': PersonasPage,
  '/rrhh|cargos': CargosPage,
  '/rrhh|contratos': ContratosPage,
  '/seguridad|usuarios': UsuariosPage,
  '/seguridad|perfiles': PerfilesPage,
  '/seguridad|permisos': PermisosPage,
};

export default REGISTRO_PAGINAS;
