import { useMemo, useState } from 'react';
import { MODULOS_NAVEGACION } from './config/navigation.config.js';
import { REGISTRO_PAGINAS } from './config/paginas.config.js';
import { EmptyState } from './components/common/data/EmptyState/index.js';
import { ErrorBoundary } from './components/common/feedback/ErrorBoundary/index.js';
import { useAuth } from './hooks/auth-rbac/useAuth.js';
import { MainLayout } from './layouts/MainLayout.jsx';
import { LoginPage } from './pages/auth-rbac/LoginPage.jsx';
import { SeguridadNominaPage } from './pages/auth-rbac/SeguridadNominaPage.jsx';
import { AccesoDenegadoPage } from './pages/system/AccesoDenegadoPage.jsx';
import { NotFoundPage } from './pages/system/NotFoundPage.jsx';
import { RUTAS_APP, resolverRuta } from './router/AppRouter.jsx';

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
  const [{ ruta: rutaSolicitada, subruta: subrutaSolicitada }, setNavegacion] =
    useState(() => ({
      ruta: sesion ? '/seguridad-nomina' : '/login',
      subruta: null,
    }));

  const { ruta, subruta } = useMemo(() => {
    if (!sesion) return { ruta: '/login', subruta: null };
    if (!seguridadNominaAceptada) {
      return { ruta: '/seguridad-nomina', subruta: null };
    }
    if (rutaSolicitada === '/login' || rutaSolicitada === '/seguridad-nomina') {
      return { ruta: '/inicio', subruta: null };
    }

    return { ruta: rutaSolicitada, subruta: subrutaSolicitada };
  }, [sesion, seguridadNominaAceptada, rutaSolicitada, subrutaSolicitada]);

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
        <ErrorBoundary key={`${ruta}|${subruta ?? ''}`}>{contenido}</ErrorBoundary>
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
