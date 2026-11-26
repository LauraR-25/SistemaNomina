import { useEffect, useState } from 'react';
import { MODULOS_NAVEGACION } from './config/navigation.config.js';
import { EmptyState } from './components/common/data/EmptyState/index.js';
import { useAuth } from './hooks/auth-rbac/useAuth.js';
import { MainLayout } from './layouts/MainLayout.jsx';
import { LoginPage } from './pages/auth-rbac/LoginPage.jsx';
import { PermisosPage } from './pages/auth-rbac/PermisosPage.jsx';
import { PerfilesPage } from './pages/auth-rbac/PerfilesPage.jsx';
import { SeguridadNominaPage } from './pages/auth-rbac/SeguridadNominaPage.jsx';
import { UsuariosPage } from './pages/auth-rbac/UsuariosPage.jsx';
import { BancosPage } from './pages/catalogos-tenant/BancosPage.jsx';
import { CuentasBancariasPage } from './pages/catalogos-tenant/CuentasBancariasPage.jsx';
import { EmpresasPage } from './pages/catalogos-tenant/EmpresasPage.jsx';
import { AportesLeyPage } from './pages/conceptos-novedades-ley/AportesLeyPage.jsx';
import { ConceptosPage } from './pages/conceptos-novedades-ley/ConceptosPage.jsx';
import { NovedadesPage } from './pages/conceptos-novedades-ley/NovedadesPage.jsx';
import { RegistroHorasPage } from './pages/conceptos-novedades-ley/RegistroHorasPage.jsx';
import { DashboardPage } from './pages/dashboard/DashboardPage.jsx';
import { PeriodosPage } from './pages/nomina-recibos/PeriodosPage.jsx';
import { PrenominaPage } from './pages/nomina-recibos/PrenominaPage.jsx';
import { RecibosPage } from './pages/nomina-recibos/RecibosPage.jsx';
import { CuotasPrestamoPage } from './pages/prestamos/CuotasPrestamoPage.jsx';
import { PrestamosPage } from './pages/prestamos/PrestamosPage.jsx';
import { CargosPage } from './pages/rrhh-contratos/CargosPage.jsx';
import { ContratosPage } from './pages/rrhh-contratos/ContratosPage.jsx';
import { PersonasPage } from './pages/rrhh-contratos/PersonasPage.jsx';
import { AccesoDenegadoPage } from './pages/system/AccesoDenegadoPage.jsx';
import { NotFoundPage } from './pages/system/NotFoundPage.jsx';
import { RUTAS_APP, resolverRuta } from './router/AppRouter.jsx';

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

const RUTAS_DE_MODULOS = new Set(
  MODULOS_NAVEGACION.map((modulo) => modulo.ruta)
);
const RUTAS_CONOCIDAS = new Set([
  ...RUTAS_APP.map((ruta) => ruta.path),
  ...RUTAS_DE_MODULOS,
  '/acceso-denegado',
]);
const MOTIVOS_DENEGACION = new Set(['SIN_OPCION', 'SIN_PERFIL']);

function dividirDestino(destino) {
  if (destino && typeof destino === 'object') {
    return {
      ruta: destino.ruta || '/inicio',
      subruta: destino.subruta ?? null,
    };
  }

  const texto = String(destino ?? '/inicio').trim() || '/inicio';
  const modulo = MODULOS_NAVEGACION.find(
    (entrada) => texto === entrada.ruta || texto.startsWith(`${entrada.ruta}/`)
  );

  if (!modulo) return { ruta: texto, subruta: null };
  if (texto === modulo.ruta) return { ruta: modulo.ruta, subruta: null };

  return {
    ruta: modulo.ruta,
    subruta: texto.slice(modulo.ruta.length + 1),
  };
}

function esRutaValida(ruta, subruta) {
  if (!RUTAS_CONOCIDAS.has(ruta)) return false;
  if (!subruta) return true;

  const modulo = MODULOS_NAVEGACION.find((entrada) => entrada.ruta === ruta);

  return Boolean(
    modulo?.subitems?.some(
      (item) => item.id === subruta || `${modulo.ruta}/${item.id}` === subruta
    )
  );
}

function ModuloEnConstruccion() {
  return (
    <EmptyState
      titulo="Módulo en construcción"
      mensaje="Este módulo estará disponible en una próxima versión."
      image={false}
    />
  );
}

export function AppShell() {
  const { sesion, seguridadNominaAceptada, cerrarSesion } = useAuth();
  const [{ ruta, subruta }, setNavegacion] = useState(() => ({
    ruta: sesion ? '/seguridad-nomina' : '/login',
    subruta: null,
  }));

  useEffect(() => {
    if (!sesion && ruta !== '/login') {
      setNavegacion({ ruta: '/login', subruta: null });
      return;
    }

    if (
      sesion &&
      !seguridadNominaAceptada &&
      ruta !== '/login' &&
      ruta !== '/seguridad-nomina'
    ) {
      setNavegacion({ ruta: '/seguridad-nomina', subruta: null });
      return;
    }

    if (
      sesion &&
      seguridadNominaAceptada &&
      (ruta === '/login' || ruta === '/seguridad-nomina')
    ) {
      setNavegacion({ ruta: '/inicio', subruta: null });
    }
  }, [sesion, seguridadNominaAceptada, ruta]);

  function navegar(destino) {
    setNavegacion(dividirDestino(destino));
  }

  function irASeguridadNomina() {
    setNavegacion({ ruta: '/seguridad-nomina', subruta: null });
  }

  function irAInicio() {
    setNavegacion({ ruta: '/inicio', subruta: null });
  }

  function manejarCerrarSesion() {
    cerrarSesion();
    setNavegacion({ ruta: '/login', subruta: null });
  }

  const resolucion = resolverRuta({
    path: ruta,
    sesion,
    seguridadNominaAceptada,
  });
  const acceso = RUTAS_APP.some((entrada) => entrada.path === ruta)
    ? resolucion.acceso
    : resolverRuta({
        path: '/inicio',
        sesion,
        seguridadNominaAceptada,
      }).acceso;

  const hayDenegacion =
    acceso?.permitido === false && MOTIVOS_DENEGACION.has(acceso?.motivo);
  const Pagina = REGISTRO_PAGINAS[`${ruta}|${subruta ?? ''}`];

  function conLayout(contenido) {
    return (
      <MainLayout
        rutaActual={ruta}
        subrutaActual={subruta}
        onNavegar={navegar}
        onCerrarSesion={manejarCerrarSesion}
      >
        {contenido}
      </MainLayout>
    );
  }

  if (hayDenegacion || ruta === '/acceso-denegado') {
    return conLayout(<AccesoDenegadoPage onVolver={irAInicio} />);
  }

  if (!esRutaValida(ruta, subruta)) {
    return conLayout(<NotFoundPage onVolver={irAInicio} />);
  }

  if (ruta === '/login' || !sesion) {
    return <LoginPage onContinuar={irASeguridadNomina} />;
  }

  if (ruta === '/seguridad-nomina') {
    return <SeguridadNominaPage onContinuar={irAInicio} />;
  }

  if (!seguridadNominaAceptada || !acceso?.permitido) {
    return resolucion.ruta === '/seguridad-nomina' ? (
      <SeguridadNominaPage onContinuar={irAInicio} />
    ) : (
      <LoginPage onContinuar={irASeguridadNomina} />
    );
  }

  const Contenido = Pagina ?? ModuloEnConstruccion;

  return conLayout(<Contenido onNavegar={navegar} />);
}

export default AppShell;
