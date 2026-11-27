import { useEffect, useMemo, useState } from 'react';
import { ConceptoForm } from '../../components/conceptos-novedades-ley/ConceptoForm/index.js';
import { TablaConceptos } from '../../components/conceptos-novedades-ley/TablaConceptos/index.js';
import {
  Badge,
  Button,
  ConfirmDialog,
  Modal,
  PageHeader,
  Pagination,
  SearchInput,
  Select,
  Toolbar,
} from '../../components/common/index.js';
import { useAuth } from '../../hooks/auth-rbac/useAuth.js';
import { useConceptos } from '../../hooks/conceptos-novedades-ley/useConceptos.js';
import { useNotificacion } from '../../hooks/ui/useNotificacion.js';
import { useTablaControles } from '../../hooks/ui/useTablaControles.js';
import { crearModeloConceptosPage } from './conceptosPage.model.js';
import styles from './ConceptosPage.module.css';

const FILTROS_TIPO = [
  { value: 'ASIGNACION', label: 'Asignaciones' },
  { value: 'DEDUCCION', label: 'Deducciones' },
  { value: 'APORTE_PATRONAL', label: 'Aportes patronales' },
];

const FILTROS_CATEGORIA = [
  { value: 'SALARIO_BASE', label: 'Salario base' },
  { value: 'LEY', label: 'Ley' },
  { value: 'OPCIONAL', label: 'Opcional' },
  { value: 'BONO', label: 'Bono' },
  { value: 'PRESTAMO', label: 'Préstamo' },
  { value: 'HORA_EXTRA', label: 'Hora extra' },
  { value: 'AJUSTE', label: 'Ajuste' },
];

const FILTROS_ESTADO = [
  { value: 'ACTIVO', label: 'Activos' },
  { value: 'INACTIVO', label: 'Inactivos' },
];

function esSistema(concepto) {
  return concepto.categoria === 'LEY' || concepto.categoria === 'SALARIO_BASE';
}

export function ConceptosPage({ onNavegar, conceptosIniciales }) {
  const { notificar } = useNotificacion();
  const { empresa } = useAuth();
  const {
    conceptos,
    loading,
    error,
    cargarConceptos,
    crearConcepto,
    actualizarConcepto,
    desactivarConcepto,
    eliminarConcepto,
  } = useConceptos(empresa?.id);
  const [modelo] = useState(() => crearModeloConceptosPage());
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [modal, setModal] = useState({ abierto: false, registro: null });
  const [confirmacion, setConfirmacion] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarConceptos();
  }, [cargarConceptos]);

  const fuenteConceptos = conceptosIniciales ?? conceptos;

  const registros = useMemo(() => {
    let lista = fuenteConceptos;

    if (filtroTipo) {
      lista = lista.filter((concepto) => concepto.tipo_concepto === filtroTipo);
    }
    if (filtroCategoria) {
      lista = lista.filter((concepto) => concepto.categoria === filtroCategoria);
    }
    if (filtroEstado) {
      const activo = filtroEstado === 'ACTIVO';
      lista = lista.filter((concepto) => (concepto.activo !== false) === activo);
    }

    return lista;
  }, [fuenteConceptos, filtroTipo, filtroCategoria, filtroEstado]);

  const tabla = useTablaControles(registros, {
    campos: [
      'codigo',
      'nombre',
      'tipo_concepto',
      'categoria',
      'naturaleza',
      'unidad',
    ],
  });

  function abrirNuevo() {
    setModal({ abierto: true, registro: null });
  }

  function abrirEditar(registro) {
    setModal({ abierto: true, registro });
  }

  function cerrarModal() {
    setModal({ abierto: false, registro: null });
  }

  async function guardar(datos) {
    setGuardando(true);
    const res = modal.registro
      ? await actualizarConcepto(modal.registro.id, datos)
      : await crearConcepto(datos);
    setGuardando(false);

    if (!res?.ok) {
      notificar({
        tipo: 'error',
        titulo: modal.registro
          ? 'No se pudo actualizar el concepto'
          : 'No se pudo registrar el concepto',
        mensaje: res?.message,
      });
      return;
    }

    notificar({
      tipo: 'exito',
      titulo: modal.registro ? 'Concepto actualizado' : 'Concepto registrado',
      mensaje: res.message,
    });
    cerrarModal();
    await cargarConceptos();
  }

  async function confirmarAccion() {
    if (!confirmacion) return;

    setGuardando(true);
    const res =
      confirmacion.tipo === 'eliminar'
        ? await eliminarConcepto(confirmacion.registro.id)
        : await desactivarConcepto(confirmacion.registro.id);
    setGuardando(false);

    if (!res?.ok) {
      notificar({
        tipo: 'error',
        titulo: 'No se pudo completar la acción',
        mensaje: res?.message,
      });
      return;
    }

    notificar({
      tipo: 'exito',
      titulo:
        confirmacion.tipo === 'eliminar'
          ? 'Concepto eliminado'
          : 'Concepto desactivado',
      mensaje: res.message,
    });
    setConfirmacion(null);
    await cargarConceptos();
  }

  const eliminarHabilitado = (registro) => !esSistema(registro);

  return (
    <div className={styles.pagina}>
      <PageHeader
        titulo={modelo.titulo}
        descripcion="Administra los conceptos de asignación, deducción y aporte patronal de la nómina."
        breadcrumbs={[
          {
            label: 'Conceptos',
            onClick: onNavegar
              ? () => onNavegar({ ruta: '/conceptos', subruta: 'conceptos' })
              : undefined,
          },
          { label: 'Conceptos' },
        ]}
        badge={{
          etiqueta: `${registros.length} registros`,
          variante: 'neutral',
        }}
        actions={
          <Button iconLeft="plus" onClick={abrirNuevo}>
            Nuevo concepto
          </Button>
        }
      />

      <Toolbar
        search={
          <SearchInput
            value={tabla.busqueda}
            onValueChange={tabla.setBusqueda}
            placeholder="Buscar por código, nombre, tipo o categoría"
            ariaLabel="Buscar conceptos"
          />
        }
        filters={
          <>
            <Select
              size="sm"
              value={filtroTipo}
              onChange={(evento) => setFiltroTipo(evento.target.value)}
              options={FILTROS_TIPO}
              placeholder="Todos los tipos"
              aria-label="Filtrar conceptos por tipo"
            />
            <Select
              size="sm"
              value={filtroCategoria}
              onChange={(evento) => setFiltroCategoria(evento.target.value)}
              options={FILTROS_CATEGORIA}
              placeholder="Todas las categorías"
              aria-label="Filtrar conceptos por categoría"
            />
            <Select
              size="sm"
              value={filtroEstado}
              onChange={(evento) => setFiltroEstado(evento.target.value)}
              options={FILTROS_ESTADO}
              placeholder="Todos los estados"
              aria-label="Filtrar conceptos por estado"
            />
          </>
        }
      />

      <div className={styles.contenido}>
        <TablaConceptos
          filas={tabla.filasVisibles}
          loading={loading || guardando}
          error={error}
          onRetry={cargarConceptos}
          onEditar={abrirEditar}
          onDesactivar={(registro) =>
            setConfirmacion({ tipo: 'desactivar', registro })
          }
          onEliminar={(registro) =>
            eliminarHabilitado(registro)
              ? setConfirmacion({ tipo: 'eliminar', registro })
              : undefined
          }
          orden={{ key: tabla.orden.campo, dir: tabla.orden.direccion }}
          onSort={({ key }) => tabla.cambiarOrden(key)}
        />

        <Pagination
          page={tabla.pagina}
          total={tabla.total}
          pageSize={tabla.tamPagina}
          onChange={tabla.setPagina}
          onPageSizeChange={tabla.setTamPagina}
        />
      </div>

      <Modal
        abierto={modal.abierto}
        onClose={cerrarModal}
        titulo={modal.registro ? 'Editar concepto' : 'Nuevo concepto'}
        descripcion="Define la naturaleza contable y la configuración del concepto."
        size="lg"
      >
        <div className={styles.formulario}>
          {modal.registro && esSistema(modal.registro) && (
            <Badge variant="accent" size="sm">
              Concepto de sistema: solo se puede desactivar
            </Badge>
          )}
          <ConceptoForm
            key={modal.registro?.id ?? 'nuevo'}
            initialData={modal.registro ?? undefined}
            onSubmit={guardar}
            onCancel={cerrarModal}
            loading={guardando}
            submitLabel={modal.registro ? 'Guardar cambios' : 'Registrar concepto'}
          />
        </div>
      </Modal>

      <ConfirmDialog
        abierto={Boolean(confirmacion)}
        titulo={
          confirmacion?.tipo === 'eliminar'
            ? '¿Eliminar concepto?'
            : '¿Desactivar concepto?'
        }
        mensaje={
          confirmacion?.tipo === 'eliminar'
            ? 'El concepto se eliminará solo si no tiene usos registrados.'
            : 'El concepto dejará de estar disponible para nuevas asignaciones.'
        }
        textoConfirmar={
          confirmacion?.tipo === 'eliminar' ? 'Eliminar' : 'Desactivar'
        }
        variante="peligro"
        loading={guardando}
        onConfirmar={confirmarAccion}
        onCancelar={() => setConfirmacion(null)}
      />
    </div>
  );
}

export default ConceptosPage;
