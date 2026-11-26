import { useMemo, useState } from 'react';
import { ContratoForm } from '../../components/rrhh-contratos/ContratoForm/index.js';
import { SalarioHistorial } from '../../components/rrhh-contratos/SalarioHistorial/index.js';
import { TablaContratos } from '../../components/rrhh-contratos/TablaContratos/index.js';
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
import { usePersonas } from '../../hooks/rrhh-contratos/usePersonas.js';
import { useNotificacion } from '../../hooks/ui/useNotificacion.js';
import { useTablaControles } from '../../hooks/ui/useTablaControles.js';
import { formatFecha, formatMoneda } from '../../utils/formatters.js';
import {
  actualizarContratoModelo,
  agregarContratoModelo,
  crearModeloContratosPage,
  eliminarContratoModelo,
} from './contratosPage.model.js';
import styles from './ContratosPage.module.css';

const FILTROS_ESTADO = [
  { value: 'VIGENTE', label: 'Vigentes' },
  { value: 'SUSPENDIDO', label: 'Suspendidos' },
  { value: 'FINALIZADO', label: 'Finalizados' },
];

function nombrePersona(persona) {
  if (!persona) return '—';

  return [persona.primer_nombre, persona.primer_apellido]
    .filter(Boolean)
    .join(' ');
}

export function ContratosPage({ onNavegar }) {
  const { notificar } = useNotificacion();
  const { empresa } = useAuth();
  const { personas } = usePersonas(empresa?.id);
  const [modelo, setModelo] = useState(() => crearModeloContratosPage());
  const [filtroEstado, setFiltroEstado] = useState('');
  const [modal, setModal] = useState({ abierto: false, registro: null });
  const [detalle, setDetalle] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null);

  const registros = useMemo(() => {
    if (!filtroEstado) return modelo.contratos;

    return modelo.contratos.filter(
      (contrato) => contrato.estado === filtroEstado
    );
  }, [filtroEstado, modelo.contratos]);

  const tabla = useTablaControles(registros, {
    campos: ['persona_id', 'cargo', 'cargo_id', 'tipo_pago', 'estado'],
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

  function guardar(datos) {
    if (modal.registro) {
      setModelo((actual) =>
        actualizarContratoModelo(actual, { ...datos, id: modal.registro.id })
      );
    } else {
      setModelo((actual) => agregarContratoModelo(actual, datos));
    }

    cerrarModal();
    notificar({
      tipo: 'info',
      titulo: 'Cambio registrado localmente',
      mensaje: 'El endpoint de contratos aún está pendiente.',
    });
  }

  function confirmarEliminacion() {
    setModelo((actual) => eliminarContratoModelo(actual, confirmacion.id));
    setConfirmacion(null);
    notificar({
      tipo: 'info',
      titulo: 'Contrato eliminado localmente',
      mensaje: 'El endpoint de contratos aún está pendiente.',
    });
  }

  return (
    <div className={styles.pagina}>
      <PageHeader
        titulo={modelo.titulo}
        descripcion="Consulta los contratos laborales y la evolución de los salarios."
        breadcrumbs={[
          { label: 'RRHH', onClick: onNavegar ? () => onNavegar('/rrhh') : undefined },
          { label: 'Contratos' },
        ]}
        badge={{ etiqueta: 'Pendiente', variante: 'warning' }}
        actions={
          <Button iconLeft="plus" onClick={abrirNuevo}>
            Nuevo contrato
          </Button>
        }
      />

      <Toolbar
        search={
          <SearchInput
            value={tabla.busqueda}
            onValueChange={tabla.setBusqueda}
            placeholder="Buscar por persona, cargo o estado"
            ariaLabel="Buscar contratos"
          />
        }
        filters={
          <Select
            size="sm"
            value={filtroEstado}
            onChange={(evento) => setFiltroEstado(evento.target.value)}
            options={FILTROS_ESTADO}
            placeholder="Todos los estados"
            aria-label="Filtrar contratos por estado"
          />
        }
      />

      <div className={styles.contenido}>
        <TablaContratos
          filas={tabla.filasVisibles}
          personas={personas}
          onEditar={abrirEditar}
          onEliminar={setConfirmacion}
          onVerDetalle={setDetalle}
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
        titulo={modal.registro ? 'Editar contrato' : 'Nuevo contrato'}
        descripcion="El registro se guardará localmente hasta que el endpoint esté disponible."
        size="lg"
      >
        <div className={styles.formulario}>
          <Badge variant="warning" size="sm">
            Endpoint pendiente
          </Badge>
          <ContratoForm
            key={modal.registro?.id ?? 'nuevo'}
            initialData={modal.registro ?? undefined}
            personas={personas}
            onSubmit={guardar}
            onCancel={cerrarModal}
            submitLabel={modal.registro ? 'Guardar cambios' : 'Registrar contrato'}
          />
        </div>
      </Modal>

      <Modal
        abierto={Boolean(detalle)}
        onClose={() => setDetalle(null)}
        titulo="Detalle del contrato"
        descripcion="Datos principales e historial salarial del contrato seleccionado."
        size="lg"
      >
        {detalle && (
          <div className={styles.detalle}>
            <div className={styles.datos}>
              <Badge variant="accent" size="sm">
                {nombrePersona(
                  personas.find(
                    (persona) => String(persona.id) === String(detalle.persona_id)
                  )
                )}
              </Badge>
              <Badge variant="neutral" size="sm">
                {detalle.cargo || detalle.cargo_id || 'Sin cargo'}
              </Badge>
              <Badge variant="info" size="sm">
                {formatMoneda(detalle.salario, detalle.moneda_codigo ?? 'VES')}
              </Badge>
            </div>

            <dl className={styles.resumen}>
              <div>
                <dt>Inicio</dt>
                <dd>{formatFecha(detalle.fecha_inicio ?? detalle.fecha_ingreso)}</dd>
              </div>
              <div>
                <dt>Fin</dt>
                <dd>{detalle.fecha_fin ? formatFecha(detalle.fecha_fin) : 'Indefinido'}</dd>
              </div>
              <div>
                <dt>Tipo de pago</dt>
                <dd>{detalle.tipo_pago === 'POR_HORA' ? 'Por hora' : 'Salario fijo'}</dd>
              </div>
              <div>
                <dt>Frecuencia</dt>
                <dd>{detalle.frecuencia_pago ?? '—'}</dd>
              </div>
            </dl>

            <h3 className={styles.subtitulo}>Historial salarial</h3>
            <SalarioHistorial
              historial={modelo.historialSalarios}
              contratoId={detalle.id}
              moneda={detalle.moneda_codigo ?? 'VES'}
            />
          </div>
        )}
      </Modal>

      <ConfirmDialog
        abierto={Boolean(confirmacion)}
        titulo="¿Eliminar contrato?"
        mensaje="El contrato y su historial salarial se eliminarán del listado local."
        textoConfirmar="Eliminar"
        variante="peligro"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setConfirmacion(null)}
      />
    </div>
  );
}
