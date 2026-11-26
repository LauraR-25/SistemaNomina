import { useEffect, useMemo, useState } from 'react';
import { TablaCuotas } from '../../components/prestamos/TablaCuotas/index.js';
import { ResumenPrestamo } from '../../components/prestamos/ResumenPrestamo/index.js';
import {
  Badge,
  Button,
  ConfirmDialog,
  DateInput,
  FormField,
  Input,
  Modal,
  PageHeader,
  Pagination,
  SearchInput,
  Select,
  SummaryBar,
  Toolbar,
} from '../../components/common/index.js';
import { useAuth } from '../../hooks/auth-rbac/useAuth.js';
import { usePrestamos } from '../../hooks/prestamos/usePrestamos.js';
import { useNotificacion } from '../../hooks/ui/useNotificacion.js';
import { useTablaControles } from '../../hooks/ui/useTablaControles.js';
import {
  actualizarCuotaModelo,
  crearModeloCuotasPrestamoPage,
  generarCuotasPrestamo,
} from './cuotasPrestamoPage.model.js';
import styles from './CuotasPrestamoPage.module.css';

export {
  crearModeloCuotasPrestamoPage,
  actualizarCuotasPrestamoModelo,
} from './cuotasPrestamoPage.model.js';

const FILTROS_ESTADO = [
  { value: 'PENDIENTE', label: 'Pendientes' },
  { value: 'DESCONTADA', label: 'Descontadas' },
  { value: 'CONDONADA', label: 'Condonadas' },
];

export function CuotasPrestamoPage({ onNavegar }) {
  const { notificar } = useNotificacion();
  const { empresa } = useAuth();
  const {
    prestamos,
    loading,
    error,
    cargarPrestamos,
  } = usePrestamos(empresa?.id);
  const [modelo, setModelo] = useState(() => crearModeloCuotasPrestamoPage());
  const [prestamoId, setPrestamoId] = useState(() =>
    sessionStorage.getItem('prestamoActivoId')
  );
  const [generadoPara, setGeneradoPara] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [cuotaEditada, setCuotaEditada] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null);

  useEffect(() => {
    cargarPrestamos();
  }, [cargarPrestamos]);

  useEffect(() => {
    if (prestamos.length === 0) return;
    if (!prestamoId || !prestamos.some((item) => String(item.id) === String(prestamoId))) {
      setPrestamoId(String(prestamos[0].id));
    }
  }, [prestamos, prestamoId]);

  const prestamoActivo = useMemo(
    () =>
      prestamos.find(
        (prestamo) => String(prestamo.id) === String(prestamoId)
      ) ?? null,
    [prestamos, prestamoId]
  );

  useEffect(() => {
    if (!prestamoActivo) return;

    const clave = String(prestamoActivo.id);
    if (generadoPara === clave) return;

    setModelo(
      crearModeloCuotasPrestamoPage(generarCuotasPrestamo(prestamoActivo))
    );
    setGeneradoPara(clave);
  }, [prestamoActivo, generadoPara]);

  const registros = useMemo(() => {
    if (!filtroEstado) return modelo.cuotas;

    return modelo.cuotas.filter((cuota) => cuota.estado === filtroEstado);
  }, [filtroEstado, modelo.cuotas]);

  const tabla = useTablaControles(registros, {
    campos: ['nro_cuota', 'fecha_vencimiento', 'monto_cuota', 'estado'],
  });

  function cambiarPrestamo(id) {
    setPrestamoId(id);
    sessionStorage.setItem('prestamoActivoId', id);
    tabla.setPagina(1);
    tabla.setBusqueda('');
  }

  function abrirEditar(cuota) {
    setCuotaEditada({
      id: cuota.id,
      fecha_vencimiento: cuota.fecha_vencimiento ?? '',
      monto_cuota: cuota.monto_cuota ?? cuota.monto ?? 0,
    });
  }

  function cerrarModal() {
    setCuotaEditada(null);
  }

  function guardarCuota() {
    const monto = Number(cuotaEditada.monto_cuota);
    setModelo((actual) =>
      actualizarCuotaModelo(actual, cuotaEditada.id, {
        fecha_vencimiento: cuotaEditada.fecha_vencimiento,
        monto_cuota: monto,
        monto,
      })
    );
    cerrarModal();
    notificar({
      tipo: 'info',
      titulo: 'Cuota actualizada localmente',
      mensaje: 'El endpoint de cuotas aún está pendiente.',
    });
  }

  function descontarCuota(cuota) {
    setModelo((actual) =>
      actualizarCuotaModelo(actual, cuota.id, {
        estado: 'DESCONTADA',
        monto_descontado: cuota.monto_cuota ?? cuota.monto ?? 0,
      })
    );
    notificar({
      tipo: 'info',
      titulo: 'Cuota marcada como descontada',
      mensaje: 'El cambio se registró localmente.',
    });
  }

  function confirmarCondonacion() {
    setModelo((actual) =>
      actualizarCuotaModelo(actual, confirmacion.id, {
        estado: 'CONDONADA',
      })
    );
    setConfirmacion(null);
    notificar({
      tipo: 'info',
      titulo: 'Cuota condonada localmente',
      mensaje: 'El cambio se registró localmente.',
    });
  }

  const opcionesPrestamos = prestamos.map((prestamo) => ({
    value: String(prestamo.id),
    label: `Préstamo #${prestamo.id} · ${prestamo.persona?.primer_nombre ?? ''} ${
      prestamo.persona?.primer_apellido ?? ''
    }`.trim(),
  }));

  return (
    <div className={styles.pagina}>
      <PageHeader
        titulo={modelo.titulo}
        descripcion="Genera y controla el cronograma de cuotas de cada préstamo."
        breadcrumbs={[
          {
            label: 'Préstamos',
            onClick: onNavegar ? () => onNavegar('/prestamos') : undefined,
          },
          { label: 'Cuotas' },
        ]}
        badge={{ etiqueta: 'Pendiente', variante: 'warning' }}
      />

      <div className={styles.resumen}>
        <ResumenPrestamo
          prestamo={prestamoActivo ?? {}}
          cuotas={modelo.cuotas}
          loading={loading}
        />
        <SummaryBar
          titulo="Resumen del cronograma"
          items={[
            { label: 'Cuotas', value: modelo.cuotas.length },
            { label: 'Saldo pendiente', value: modelo.saldoPendiente, highlight: true },
          ]}
          moneda={prestamoActivo?.moneda_codigo ?? 'VES'}
        />
      </div>

      <Toolbar
        search={
          <SearchInput
            value={tabla.busqueda}
            onValueChange={tabla.setBusqueda}
            placeholder="Buscar por número, fecha o estado"
            ariaLabel="Buscar cuotas"
          />
        }
        filters={
          <>
            <Select
              size="sm"
              value={prestamoId ?? ''}
              onChange={(evento) => cambiarPrestamo(evento.target.value)}
              options={opcionesPrestamos}
              placeholder="Seleccione un préstamo"
              aria-label="Seleccionar préstamo"
            />
            <Select
              size="sm"
              value={filtroEstado}
              onChange={(evento) => setFiltroEstado(evento.target.value)}
              options={FILTROS_ESTADO}
              placeholder="Todos los estados"
              aria-label="Filtrar cuotas por estado"
            />
          </>
        }
      />

      <div className={styles.contenido}>
        <TablaCuotas
          filas={tabla.filasVisibles}
          moneda={prestamoActivo?.moneda_codigo ?? 'VES'}
          loading={loading}
          error={error}
          onRetry={cargarPrestamos}
          onEditar={abrirEditar}
          onDescontar={descontarCuota}
          onCondonar={setConfirmacion}
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
        abierto={Boolean(cuotaEditada)}
        onClose={cerrarModal}
        titulo="Editar cuota"
        descripcion="El ajuste se guardará localmente hasta que el endpoint esté disponible."
        size="sm"
      >
        {cuotaEditada && (
          <div className={styles.formulario}>
            <Badge variant="warning" size="sm">
              Endpoint pendiente
            </Badge>
            <FormField label="Fecha de vencimiento">
              <DateInput
                name="fecha_vencimiento"
                value={cuotaEditada.fecha_vencimiento}
                onChange={(evento) =>
                  setCuotaEditada((actual) => ({
                    ...actual,
                    fecha_vencimiento: evento.target.value,
                  }))
                }
              />
            </FormField>
            <FormField label="Monto de la cuota">
              <Input
                name="monto_cuota"
                type="number"
                min="0"
                step="0.01"
                value={cuotaEditada.monto_cuota}
                onChange={(evento) =>
                  setCuotaEditada((actual) => ({
                    ...actual,
                    monto_cuota: evento.target.value,
                  }))
                }
              />
            </FormField>
            <div className={styles.acciones}>
              <Button variant="secondary" onClick={cerrarModal}>
                Cancelar
              </Button>
              <Button onClick={guardarCuota}>Guardar cambios</Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        abierto={Boolean(confirmacion)}
        titulo="¿Condonar cuota?"
        mensaje="La cuota se marcará como condonada en el cronograma local."
        textoConfirmar="Condonar"
        variante="peligro"
        onConfirmar={confirmarCondonacion}
        onCancelar={() => setConfirmacion(null)}
      />
    </div>
  );
}

export default CuotasPrestamoPage;
