import { useEffect, useMemo, useState } from 'react';
import { PersonaForm } from '../../components/rrhh-contratos/PersonaForm/index.js';
import { SalarioHistorial } from '../../components/rrhh-contratos/SalarioHistorial/index.js';
import { TablaPersonas } from '../../components/rrhh-contratos/TablaPersonas/index.js';
import { Badge, Button, ConfirmDialog, Modal, PageHeader, Pagination, SearchInput, Select, Toolbar } from '../../components/common/index.js';
import { useAuth } from '../../hooks/auth-rbac/useAuth.js';
import { usePersonas } from '../../hooks/rrhh-contratos/usePersonas.js';
import { useNotificacion } from '../../hooks/ui/useNotificacion.js';
import { useTablaControles } from '../../hooks/ui/useTablaControles.js';
import styles from './PersonasPage.module.css';

const FILTROS_ESTADO = [{ value: 'ACTIVO', label: 'Activos' }, { value: 'INACTIVO', label: 'Inactivos' }];
function nombreCompleto(p) { return [p?.primer_nombre, p?.segundo_nombre, p?.primer_apellido, p?.segundo_apellido].filter(Boolean).join(' '); }

export function PersonasPage({ onNavegar }) {
  const { notificar } = useNotificacion();
  const { empresa } = useAuth();
  const { personas, loading, error, cargarPersonas, crearPersona, actualizarPersona, eliminarPersona } = usePersonas({ empresaId: empresa?.id });
  const [filtroEstado, setFiltroEstado] = useState('');
  const [modal, setModal] = useState({ abierto: false, registro: null });
  const [detalle, setDetalle] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => { cargarPersonas(); }, [cargarPersonas]);

  const registros = useMemo(() => filtroEstado ? personas.filter((p) => p.estado === filtroEstado) : personas, [filtroEstado, personas]);
  const tabla = useTablaControles(registros, { campos: ['cedula', 'primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido', 'email', 'nro_tlf'] });

  function cerrarModal() { setModal({ abierto: false, registro: null }); }
  async function guardar(datos) {
    setGuardando(true);
    try {
      if (modal.registro) {
        await actualizarPersona(modal.registro.id, datos);
        notificar({ tipo: 'exito', titulo: 'Persona actualizada', mensaje: 'La persona se actualizó correctamente.' });
      } else {
        await crearPersona(datos);
        notificar({ tipo: 'exito', titulo: 'Persona registrada', mensaje: 'La persona se registró correctamente.' });
      }
      cerrarModal();
    } catch (err) { notificar({ tipo: 'error', titulo: 'No se pudo guardar', mensaje: err.message }); }
    finally { setGuardando(false); }
  }

  async function confirmarEliminacion() {
    if (!confirmacion) return;
    setGuardando(true);
    try {
      await eliminarPersona(confirmacion.id);
      notificar({ tipo: 'exito', titulo: 'Persona eliminada', mensaje: 'La persona fue eliminada.' });
      setConfirmacion(null);
    } catch (err) { notificar({ tipo: 'error', titulo: 'No se pudo eliminar', mensaje: err.message }); }
    finally { setGuardando(false); }
  }

  return (
    <div className={styles.pagina}>
      <PageHeader titulo="Personas y Empleados" descripcion="Gestiona las personas y consulta su historial salarial." breadcrumbs={[{ label: 'RRHH', onClick: onNavegar ? () => onNavegar('/rrhh') : undefined }, { label: 'Personas' }]} badge={{ etiqueta: `${registros.length} registros`, variante: 'neutral' }} actions={<Button iconLeft="plus" onClick={() => setModal({ abierto: true, registro: null })}>Nueva persona</Button>} />
      <Toolbar search={<SearchInput value={tabla.busqueda} onValueChange={tabla.setBusqueda} placeholder="Buscar por cédula, nombre, correo o teléfono" ariaLabel="Buscar personas" />} filters={<Select size="sm" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} options={FILTROS_ESTADO} placeholder="Todos los estados" aria-label="Filtrar personas por estado" />} />
      <div className={styles.contenido}>
        <TablaPersonas filas={tabla.filasVisibles} loading={loading || guardando} error={error} onRetry={cargarPersonas} onEditar={(r) => setModal({ abierto: true, registro: r })} onEliminar={setConfirmacion} onVerDetalle={setDetalle} orden={{ key: tabla.orden.campo, dir: tabla.orden.direccion }} onSort={({ key }) => tabla.cambiarOrden(key)} />
        <Pagination page={tabla.pagina} total={tabla.total} pageSize={tabla.tamPagina} onChange={tabla.setPagina} onPageSizeChange={tabla.setTamPagina} />
      </div>
      <Modal abierto={modal.abierto} onClose={cerrarModal} titulo={modal.registro ? 'Editar persona' : 'Nueva persona'} descripcion="Los datos personales se ajustan a los catálogos de RRHH." size="lg">
        <PersonaForm key={modal.registro?.id ?? 'nueva'} initialData={modal.registro ?? undefined} onSubmit={guardar} onCancel={cerrarModal} loading={guardando} submitLabel={modal.registro ? 'Guardar cambios' : 'Registrar persona'} />
      </Modal>
      <Modal abierto={Boolean(detalle)} onClose={() => setDetalle(null)} titulo={detalle ? nombreCompleto(detalle) : 'Detalle de persona'} descripcion="Datos de la persona seleccionada." size="lg">
        <div className={styles.detalle}>
          {detalle && <div className={styles.datos}><Badge variant="neutral" size="sm">{detalle.cedula}</Badge><Badge variant="accent" size="sm">{detalle.estado ?? 'ACTIVO'}</Badge></div>}
          <SalarioHistorial historial={[]} personaId={detalle?.id} moneda="VES" />
        </div>
      </Modal>
      <ConfirmDialog abierto={Boolean(confirmacion)} titulo="¿Eliminar persona?" mensaje={`Se eliminará a "${nombreCompleto(confirmacion ?? {})}". Esta acción no se puede deshacer.`} textoConfirmar="Eliminar" variante="peligro" loading={guardando} onConfirmar={confirmarEliminacion} onCancelar={() => setConfirmacion(null)} />
    </div>
  );
}
