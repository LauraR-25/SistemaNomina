import { useEffect, useMemo, useState } from 'react';
import { CargoForm } from '../../components/rrhh-contratos/CargoForm/index.js';
import { TablaCargos } from '../../components/rrhh-contratos/TablaCargos/index.js';
import { Button, ConfirmDialog, Modal, PageHeader, Pagination, SearchInput, Select, Toolbar } from '../../components/common/index.js';
import { useAuth } from '../../hooks/auth-rbac/useAuth.js';
import { useCargos } from '../../hooks/rrhh-contratos/useCargos.js';
import { useNotificacion } from '../../hooks/ui/useNotificacion.js';
import { useTablaControles } from '../../hooks/ui/useTablaControles.js';
import styles from './CargosPage.module.css';

const FILTROS_ESTADO = [{ value: 'ACTIVO', label: 'Activos' }, { value: 'INACTIVO', label: 'Inactivos' }];

export function CargosPage({ onNavegar }) {
  const { notificar } = useNotificacion();
  const { empresa } = useAuth();
  const { cargos, cargando, error, cargarCargos, crearCargo, actualizarCargo, eliminarCargo, desactivarCargo } = useCargos({ empresaId: empresa?.id });
  const [filtroEstado, setFiltroEstado] = useState('');
  const [modal, setModal] = useState({ abierto: false, registro: null });
  const [confirmacion, setConfirmacion] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => { cargarCargos(); }, [cargarCargos]);

  const registros = useMemo(() => {
    if (!filtroEstado) return cargos;
    return cargos.filter((c) => (filtroEstado === 'ACTIVO' ? c.activo !== false : c.activo === false));
  }, [cargos, filtroEstado]);
  const tabla = useTablaControles(registros, { campos: ['nombre', 'descripcion'] });

  function cerrarModal() { setModal({ abierto: false, registro: null }); }
  async function guardar(datos) {
    setGuardando(true);
    try {
      if (modal.registro) {
        await actualizarCargo(modal.registro.id, datos);
        notificar({ tipo: 'exito', titulo: 'Cargo actualizado', mensaje: 'El cargo se actualizó correctamente.' });
      } else {
        await crearCargo(datos);
        notificar({ tipo: 'exito', titulo: 'Cargo creado', mensaje: 'El cargo se registró correctamente.' });
      }
      cerrarModal();
    } catch (err) { notificar({ tipo: 'error', titulo: 'No se pudo guardar', mensaje: err.message }); }
    finally { setGuardando(false); }
  }

  async function confirmarEliminacion() {
    if (!confirmacion) return;
    setGuardando(true);
    try {
      if (confirmacion.activo !== false) {
        await desactivarCargo(confirmacion.id);
        notificar({ tipo: 'exito', titulo: 'Cargo desactivado', mensaje: 'El cargo fue desactivado.' });
      } else {
        await eliminarCargo(confirmacion.id);
        notificar({ tipo: 'exito', titulo: 'Cargo eliminado', mensaje: 'El cargo fue eliminado.' });
      }
    } catch (err) { notificar({ tipo: 'error', titulo: 'No se pudo completar la acción', mensaje: err.message }); }
    finally { setGuardando(false); setConfirmacion(null); }
  }

  return (
    <div className={styles.pagina}>
      <PageHeader
        titulo="Catálogo de Cargos"
        descripcion="Administra los cargos que se asocian a los contratos laborales."
        breadcrumbs={[{ label: 'RRHH', onClick: onNavegar ? () => onNavegar('/rrhh') : undefined }, { label: 'Cargos' }]}
        badge={{ etiqueta: `${registros.length} registros`, variante: 'neutral' }}
        actions={<Button iconLeft="plus" onClick={() => setModal({ abierto: true, registro: null })}>Nuevo cargo</Button>}
      />
      <Toolbar
        search={<SearchInput value={tabla.busqueda} onValueChange={tabla.setBusqueda} placeholder="Buscar por nombre o descripción" ariaLabel="Buscar cargos" />}
        filters={<Select size="sm" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} options={FILTROS_ESTADO} placeholder="Todos los estados" aria-label="Filtrar cargos por estado" />}
      />
      <div className={styles.contenido}>
        <TablaCargos filas={tabla.filasVisibles} loading={cargando || guardando} error={error} onRetry={cargarCargos} onEditar={(r) => setModal({ abierto: true, registro: r })} onEliminar={setConfirmacion} orden={{ key: tabla.orden.campo, dir: tabla.orden.direccion }} onSort={({ key }) => tabla.cambiarOrden(key)} />
        <Pagination page={tabla.pagina} total={tabla.total} pageSize={tabla.tamPagina} onChange={tabla.setPagina} onPageSizeChange={tabla.setTamPagina} />
      </div>
      <Modal abierto={modal.abierto} onClose={cerrarModal} titulo={modal.registro ? 'Editar cargo' : 'Nuevo cargo'} descripcion="Completa los datos del cargo." size="sm">
        <div className={styles.formulario}>
          <CargoForm key={modal.registro?.id ?? 'nuevo'} initialData={modal.registro ?? undefined} onSubmit={guardar} onCancel={cerrarModal} loading={guardando} submitLabel={modal.registro ? 'Guardar cambios' : 'Registrar cargo'} />
        </div>
      </Modal>
      <ConfirmDialog abierto={Boolean(confirmacion)} titulo={confirmacion?.activo !== false ? '¿Desactivar cargo?' : '¿Eliminar cargo?'} mensaje={confirmacion?.activo !== false ? `Se desactivará "${confirmacion?.nombre ?? ''}".` : `Se eliminará "${confirmacion?.nombre ?? ''}". Esta acción no se puede deshacer.`} textoConfirmar={confirmacion?.activo !== false ? 'Desactivar' : 'Eliminar'} variante="peligro" loading={guardando} onConfirmar={confirmarEliminacion} onCancelar={() => setConfirmacion(null)} />
    </div>
  );
}
