import { useEffect, useMemo, useState } from 'react';
import { AsignacionConceptoForm } from '../../components/conceptos-novedades-ley/AsignacionConceptoForm/index.js';
import { TablaAsignacionesConcepto } from '../../components/conceptos-novedades-ley/TablaAsignacionesConcepto/index.js';
import { ContratoForm } from '../../components/rrhh-contratos/ContratoForm/index.js';
import { SalarioHistorial } from '../../components/rrhh-contratos/SalarioHistorial/index.js';
import { TablaContratos } from '../../components/rrhh-contratos/TablaContratos/index.js';
import { Badge, Button, ConfirmDialog, DateInput, FormField, Input, Modal, PageHeader, Pagination, SearchInput, Select, Toolbar } from '../../components/common/index.js';
import { useAuth } from '../../hooks/auth-rbac/useAuth.js';
import { useAsignacionesConcepto } from '../../hooks/conceptos-novedades-ley/useAsignacionesConcepto.js';
import { useConceptos } from '../../hooks/conceptos-novedades-ley/useConceptos.js';
import { useCargos } from '../../hooks/rrhh-contratos/useCargos.js';
import { useContratos } from '../../hooks/rrhh-contratos/useContratos.js';
import { usePersonas } from '../../hooks/rrhh-contratos/usePersonas.js';
import { useNotificacion } from '../../hooks/ui/useNotificacion.js';
import { useTablaControles } from '../../hooks/ui/useTablaControles.js';
import { formatFecha, formatMoneda } from '../../utils/formatters.js';
import styles from './ContratosPage.module.css';

const FILTROS_ESTADO = [{ value: 'VIGENTE', label: 'Vigentes' }, { value: 'SUSPENDIDO', label: 'Suspendidos' }, { value: 'FINALIZADO', label: 'Finalizados' }];
function nombrePersona(p) { return [p?.primer_nombre, p?.primer_apellido].filter(Boolean).join(' '); }

export function ContratosPage({ onNavegar, contratosIniciales, detalleInicial, asignacionesIniciales, conceptosIniciales }) {
  const { notificar } = useNotificacion();
  const { empresa } = useAuth();
  const { personas } = usePersonas({ empresaId: empresa?.id });
  const { cargos } = useCargos({ empresaId: empresa?.id });
  const { contratos, cargando, error, cargarContratos, obtenerContrato, crearContrato, actualizarContrato, registrarCambioSalario } = useContratos({ empresaId: empresa?.id });
  const { conceptos: todosConceptos } = useConceptos(empresa?.id);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [modal, setModal] = useState({ abierto: false, registro: null });
  const [detalle, setDetalle] = useState(detalleInicial ?? null);
  const [confirmacion, setConfirmacion] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [cambioSalario, setCambioSalario] = useState({ abierto: false, monto: '', vigente_desde: '', motivo: '' });
  const [asignacionModal, setAsignacionModal] = useState({ abierto: false, registro: null, modo: 'crear' });

  const {
    asignaciones,
    loading: cargandoAsignaciones,
    error: errorAsignaciones,
    cargarAsignaciones,
    crearAsignacion,
    actualizarAsignacion,
    terminarAsignacion,
  } = useAsignacionesConcepto(empresa?.id, detalle?.id);

  useEffect(() => { cargarContratos(); }, [cargarContratos]);

  useEffect(() => {
    if (detalle?.id) cargarAsignaciones();
  }, [detalle?.id, cargarAsignaciones]);

  const conceptos = conceptosIniciales ?? todosConceptos;
  const conceptosActivos = conceptos.filter((concepto) => concepto.activo !== false);
  const asignacionesVisibles = asignacionesIniciales ?? asignaciones;
  const registros = useMemo(() => {
    const base = contratosIniciales ?? contratos;
    return filtroEstado ? base.filter((c) => c.estado === filtroEstado) : base;
  }, [contratos, contratosIniciales, filtroEstado]);
  const tabla = useTablaControles(registros, { campos: ['persona_id', 'cargo_id', 'tipo_pago', 'frecuencia_pago', 'estado'] });

  async function abrirDetalle(registro) {
    try { const data = await obtenerContrato(registro.id); setDetalle(data || registro); }
    catch { setDetalle(registro); }
  }

  function cerrarModal() { setModal({ abierto: false, registro: null }); }
  async function guardar(datos) {
    setGuardando(true);
    try {
      if (modal.registro) {
        const r = await actualizarContrato(modal.registro.id, datos);
        notificar({ tipo: 'exito', titulo: 'Contrato actualizado', mensaje: r?.message || 'Contrato actualizado.' });
        if (detalle?.id === modal.registro.id) setDetalle(r?.data || detalle);
      } else {
        const r = await crearContrato(datos);
        notificar({ tipo: 'exito', titulo: 'Contrato creado', mensaje: r?.message || 'Contrato creado.' });
      }
      cerrarModal();
    } catch (err) { notificar({ tipo: 'error', titulo: 'No se pudo guardar', mensaje: err.message }); }
    finally { setGuardando(false); }
  }

  async function confirmarEstado() {
    if (!confirmacion) return;
    setGuardando(true);
    try {
      const r = await actualizarContrato(confirmacion.id, { estado: 'FINALIZADO' });
      notificar({ tipo: 'exito', titulo: 'Contrato finalizado', mensaje: r?.message || 'Contrato finalizado.' });
      if (detalle?.id === confirmacion.id) setDetalle(r?.data || detalle);
      setConfirmacion(null);
    } catch (err) { notificar({ tipo: 'error', titulo: 'No se pudo finalizar', mensaje: err.message }); }
    finally { setGuardando(false); }
  }

  async function guardarCambioSalario(e) {
    e.preventDefault();
    if (!detalle) return;
    setGuardando(true);
    try {
      const r = await registrarCambioSalario(detalle.id, cambioSalario);
      notificar({ tipo: 'exito', titulo: 'Cambio salarial registrado', mensaje: r?.message || 'Salario actualizado.' });
      setDetalle(r?.data || detalle);
      setCambioSalario({ abierto: false, monto: '', vigente_desde: '', motivo: '' });
    } catch (err) { notificar({ tipo: 'error', titulo: 'No se pudo registrar el cambio', mensaje: err.message }); }
    finally { setGuardando(false); }
  }

  function abrirAsignacion(registro = null, modo = 'crear') {
    setAsignacionModal({ abierto: true, registro, modo });
  }

  function cerrarAsignacion() {
    setAsignacionModal({ abierto: false, registro: null, modo: 'crear' });
  }

  async function guardarAsignacion(payload) {
    if (!detalle) return;
    const { registro, modo } = asignacionModal;
    setGuardando(true);

    let res;
    if (modo === 'editar') res = await actualizarAsignacion(registro.id, payload);
    else if (modo === 'terminar') res = await terminarAsignacion(registro.id, payload);
    else res = await crearAsignacion({ ...payload, contrato_id: detalle.id });

    setGuardando(false);

    if (!res?.ok) {
      notificar({ tipo: 'error', titulo: 'No se pudo guardar la asignación', mensaje: res?.message });
      return;
    }

    notificar({
      tipo: 'exito',
      titulo: modo === 'crear' ? 'Concepto asignado' : modo === 'editar' ? 'Asignación actualizada' : 'Asignación terminada',
      mensaje: res.message,
    });
    cerrarAsignacion();
    await cargarAsignaciones();
  }

  function irAConceptos() {
    onNavegar?.({ ruta: '/conceptos', subruta: 'conceptos' });
  }

  const moneda = empresa?.moneda_codigo || 'VES';

  return (
    <div className={styles.pagina}>
      <PageHeader titulo="Contratos Laborales" descripcion="Consulta los contratos laborales y la evolución de los salarios." breadcrumbs={[{ label: 'RRHH', onClick: onNavegar ? () => onNavegar({ ruta: '/rrhh', subruta: 'contratos' }) : undefined }, { label: 'Contratos' }]} badge={{ etiqueta: `${registros.length} registros`, variante: 'neutral' }} actions={<Button iconLeft="plus" onClick={() => setModal({ abierto: true, registro: null })}>Nuevo contrato</Button>} />
      <Toolbar search={<SearchInput value={tabla.busqueda} onValueChange={tabla.setBusqueda} placeholder="Buscar por persona, cargo o estado" ariaLabel="Buscar contratos" />} filters={<Select size="sm" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} options={FILTROS_ESTADO} placeholder="Todos los estados" aria-label="Filtrar contratos por estado" />} />
      <div className={styles.contenido}>
        <TablaContratos filas={tabla.filasVisibles} personas={personas} cargos={cargos} loading={cargando || guardando} error={error} onRetry={cargarContratos} onEditar={(r) => setModal({ abierto: true, registro: r })} onEliminar={setConfirmacion} onVerDetalle={abrirDetalle} orden={{ key: tabla.orden.campo, dir: tabla.orden.direccion }} onSort={({ key }) => tabla.cambiarOrden(key)} />
        <Pagination page={tabla.pagina} total={tabla.total} pageSize={tabla.tamPagina} onChange={tabla.setPagina} onPageSizeChange={tabla.setTamPagina} />
      </div>
      <Modal abierto={modal.abierto} onClose={cerrarModal} titulo={modal.registro ? 'Editar contrato' : 'Nuevo contrato'} descripcion={modal.registro ? 'Edita los datos del contrato. El salario se gestiona desde el historial.' : 'El contrato se crea con su salario inicial en una sola operación.'} size="lg">
        <div className={styles.formulario}>
          {(!personas.length || !cargos.length) && <Badge variant="warning" size="sm">Debes tener personas y cargos activos antes de crear contratos.</Badge>}
          <ContratoForm key={modal.registro?.id ?? 'nuevo'} initialData={modal.registro ?? undefined} personas={personas} cargos={cargos} onSubmit={guardar} onCancel={cerrarModal} loading={guardando} modo={modal.registro ? 'editar' : 'crear'} submitLabel={modal.registro ? 'Guardar cambios' : 'Registrar contrato'} />
        </div>
      </Modal>
      <Modal abierto={Boolean(detalle)} onClose={() => { setDetalle(null); setCambioSalario({ abierto: false, monto: '', vigente_desde: '', motivo: '' }); }} titulo="Detalle del contrato" descripcion="Datos principales, historial salarial y conceptos asignados del contrato seleccionado." size="lg">
        {detalle && (
          <div className={styles.detalle}>
            <div className={styles.datos}>
              <Badge variant="accent" size="sm">{nombrePersona(detalle.persona) || nombrePersona(personas.find((p) => String(p.id) === String(detalle.persona_id)))}</Badge>
              <Badge variant="neutral" size="sm">{detalle.cargo?.nombre || detalle.cargo_nombre || 'Sin cargo'}</Badge>
              <Badge variant="info" size="sm">{formatMoneda(detalle.salario_vigente ?? detalle.salario_base, moneda)}</Badge>
              <Badge variant="neutral" size="sm">{detalle.estado}</Badge>
            </div>
            <dl className={styles.resumen}>
              <div><dt>Inicio</dt><dd>{formatFecha(detalle.fecha_inicio)}</dd></div>
              <div><dt>Fin</dt><dd>{detalle.fecha_fin ? formatFecha(detalle.fecha_fin) : 'Indefinido'}</dd></div>
              <div><dt>Tipo de pago</dt><dd>{detalle.tipo_pago === 'POR_HORA' ? 'Por hora' : 'Salario fijo'}</dd></div>
              <div><dt>Frecuencia</dt><dd>{detalle.frecuencia_pago}</dd></div>
            </dl>
            <div className={styles.subtituloRow}><h3 className={styles.subtitulo}>Conceptos asignados</h3><Button size="sm" variant="secondary" onClick={() => abrirAsignacion(null, 'crear')} disabled={!conceptosActivos.length || detalle.estado !== 'VIGENTE'}>Asignar concepto</Button></div>
            {!conceptosActivos.length && (
              <div className={styles.aviso}>
                No hay conceptos activos disponibles para asignar.
                <Button size="sm" variant="secondary" onClick={irAConceptos}>Ir a Conceptos</Button>
              </div>
            )}
            <TablaAsignacionesConcepto
              filas={asignacionesVisibles}
              moneda={moneda}
              loading={cargandoAsignaciones}
              error={errorAsignaciones}
              onRetry={cargarAsignaciones}
              onEditar={(registro) => abrirAsignacion(registro, 'editar')}
              onTerminar={(registro) => abrirAsignacion(registro, 'terminar')}
              emptyAction={conceptosActivos.length > 0 ? <Button size="sm" variant="secondary" onClick={() => abrirAsignacion(null, 'crear')}>Asignar concepto</Button> : null}
            />
            <div className={styles.subtituloRow}><h3 className={styles.subtitulo}>Historial salarial</h3><Button size="sm" variant="secondary" onClick={() => setCambioSalario((s) => ({ ...s, abierto: !s.abierto }))}>Registrar cambio de salario</Button></div>
            {cambioSalario.abierto && (
              <form className={styles.formCambioSalario} onSubmit={guardarCambioSalario}>
                <FormField label="Nuevo monto" required><Input type="number" min="0" step="0.01" value={cambioSalario.monto} onChange={(e) => setCambioSalario((s) => ({ ...s, monto: e.target.value }))} required disabled={guardando} /></FormField>
                <FormField label="Vigente desde" required><DateInput value={cambioSalario.vigente_desde} onChange={(e) => setCambioSalario((s) => ({ ...s, vigente_desde: e.target.value }))} required disabled={guardando} /></FormField>
                <FormField label="Motivo"><Input value={cambioSalario.motivo} onChange={(e) => setCambioSalario((s) => ({ ...s, motivo: e.target.value }))} maxLength={150} disabled={guardando} /></FormField>
                <div className={styles.accionesCambio}><Button type="submit" loading={guardando}>Guardar cambio</Button></div>
              </form>
            )}
            <SalarioHistorial historial={detalle.historial_salarios || []} contratoId={detalle.id} moneda={moneda} />
          </div>
        )}
      </Modal>
      <Modal abierto={asignacionModal.abierto} onClose={cerrarAsignacion} titulo={asignacionModal.modo === 'crear' ? 'Asignar concepto' : asignacionModal.modo === 'editar' ? 'Editar asignación' : 'Terminar asignación'} descripcion={asignacionModal.modo === 'terminar' ? 'Indica la fecha en que deja de vigir la asignación.' : 'Configura el valor y la vigencia del concepto en el contrato.'} size="lg">
        <div className={styles.formulario}>
          <AsignacionConceptoForm
            key={asignacionModal.registro?.id ?? `nueva-${asignacionModal.modo}`}
            contratoId={detalle?.id}
            initialData={asignacionModal.registro ?? undefined}
            conceptos={conceptosActivos}
            modo={asignacionModal.modo}
            onSubmit={guardarAsignacion}
            onCancel={cerrarAsignacion}
            loading={guardando}
            submitLabel={asignacionModal.modo === 'crear' ? 'Asignar' : asignacionModal.modo === 'editar' ? 'Guardar cambios' : 'Terminar'}
          />
        </div>
      </Modal>
      <ConfirmDialog abierto={Boolean(confirmacion)} titulo="¿Finalizar contrato?" mensaje="El contrato pasará a estado FINALIZADO." textoConfirmar="Finalizar" variante="peligro" loading={guardando} onConfirmar={confirmarEstado} onCancelar={() => setConfirmacion(null)} />
    </div>
  );
}

export default ContratosPage;
