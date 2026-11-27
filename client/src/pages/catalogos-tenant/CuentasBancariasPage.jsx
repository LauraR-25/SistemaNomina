import { useEffect, useMemo, useState } from 'react';
import { CuentaBancariaForm } from '../../components/catalogos-tenant/CuentaBancariaForm/index.js';
import { TablaCuentasBancarias } from '../../components/catalogos-tenant/TablaCuentasBancarias/index.js';
import {
  Button,
  ConfirmDialog,
  Modal,
  PageHeader,
  Pagination,
  SearchInput,
  Select,
  Toolbar,
} from '../../components/common/index.js';
import { useCatalogos } from '../../hooks/catalogos-tenant/useCatalogos.js';
import { useCuentasBancarias } from '../../hooks/catalogos-tenant/useCuentasBancarias.js';
import { usePersonas } from '../../hooks/rrhh-contratos/usePersonas.js';
import { useNotificacion } from '../../hooks/ui/useNotificacion.js';
import { useTablaControles } from '../../hooks/ui/useTablaControles.js';
import {
  crearModeloCuentasBancariasPage,
  eliminarCuentaBancariaModelo,
  guardarCuentaBancariaModelo,
} from './cuentasBancariasPage.model.js';
import styles from './CuentasBancariasPage.module.css';

const TIPOS_CUENTA = [
  { value: 'AHORRO', label: 'Ahorro' },
  { value: 'CORRIENTE', label: 'Corriente' },
];

const FILTROS_ESTADO = [
  { value: 'ACTIVA', label: 'Activas' },
  { value: 'INACTIVA', label: 'Inactivas' },
];

export function CuentasBancariasPage({ onNavegar }) {
  const { notificar } = useNotificacion();
  const { bancos, loading: cargandoBancos, error: errorBancos, cargarCatalogos } = useCatalogos();
  const { personas, loading: cargandoPersonas, cargarPersonas } = usePersonas();
  const {
    cuentas,
    loading: cargandoCuentas,
    error: errorCuentas,
    cargarCuentas,
    crearCuenta,
    actualizarCuenta,
    eliminarCuenta,
  } = useCuentasBancarias();
  const [modelo, setModelo] = useState(() => crearModeloCuentasBancariasPage());
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [modal, setModal] = useState({ abierto: false, registro: null });
  const [confirmacion, setConfirmacion] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarCatalogos();
  }, [cargarCatalogos]);

  useEffect(() => {
    cargarCuentas();
  }, [cargarCuentas]);

  useEffect(() => {
    cargarPersonas();
  }, [cargarPersonas]);

  const modeloActual = useMemo(() => ({ ...modelo, cuentas }), [modelo, cuentas]);

  const registros = useMemo(() => {
    const lista = modeloActual.cuentas.map((cuenta) => ({
      ...cuenta,
      banco:
        cuenta.banco ||
        bancos.find((banco) => String(banco.id) === String(cuenta.banco_id)) ||
        null,
    }));

    return lista.filter((cuenta) => {
      const porTipo = !filtroTipo || cuenta.tipo_cuenta === filtroTipo;
      const porEstado =
        !filtroEstado ||
        (filtroEstado === 'ACTIVA' ? cuenta.activa !== false : cuenta.activa === false);
      return porTipo && porEstado;
    });
  }, [bancos, filtroEstado, filtroTipo, modeloActual.cuentas]);

  const tabla = useTablaControles(registros, {
    campos: ['banco.nombre', 'nro_cuenta', 'numero_cuenta', 'tipo_cuenta', 'titular'],
  });

  async function recargar() {
    await Promise.all([cargarCatalogos(), cargarCuentas(), cargarPersonas()]);
  }

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
    const siguiente = await guardarCuentaBancariaModelo(modeloActual, { registro: modal.registro, datos, crearCuenta, actualizarCuenta });
    setGuardando(false);
    setModelo(siguiente);
    if (siguiente.mensaje?.tipo === 'exito') {
      notificar({ tipo: 'exito', titulo: modal.registro ? 'Cuenta actualizada' : 'Cuenta creada', mensaje: siguiente.mensaje.texto });
      cerrarModal();
      await recargar();
      return;
    }
    notificar({ tipo: 'error', titulo: 'No se pudo guardar la cuenta', mensaje: siguiente.mensaje?.texto });
  }

  async function confirmarEliminacion() {
    setGuardando(true);
    const siguiente = await eliminarCuentaBancariaModelo(modeloActual, confirmacion.id, eliminarCuenta);
    setGuardando(false);
    setModelo(siguiente);
    setConfirmacion(null);
    if (siguiente.mensaje?.tipo === 'exito') {
      notificar({ tipo: 'exito', titulo: 'Cuenta eliminada', mensaje: siguiente.mensaje.texto });
      await recargar();
      return;
    }
    notificar({ tipo: 'error', titulo: 'No se pudo eliminar la cuenta', mensaje: siguiente.mensaje?.texto });
  }

  return (
    <div className={styles.pagina}>
      <PageHeader
        titulo={modelo.titulo}
        descripcion="Registra y organiza las cuentas bancarias de las personas."
        breadcrumbs={[
          {
            label: 'Catálogos',
            onClick: onNavegar ? () => onNavegar('/catalogos') : undefined,
          },
          { label: 'Cuentas bancarias' },
        ]}
        badge={{ etiqueta: `${registros.length} registros`, variante: 'neutral' }}
        actions={
          <Button iconLeft="plus" onClick={abrirNuevo}>
            Nueva cuenta
          </Button>
        }
      />

      <Toolbar
        search={
          <SearchInput
            value={tabla.busqueda}
            onValueChange={tabla.setBusqueda}
            placeholder="Buscar por banco, número o titular"
            ariaLabel="Buscar cuentas bancarias"
          />
        }
        filters={
          <>
            <Select
              size="sm"
              value={filtroTipo}
              onChange={(evento) => setFiltroTipo(evento.target.value)}
              options={TIPOS_CUENTA}
              placeholder="Todos los tipos"
              aria-label="Filtrar por tipo de cuenta"
            />
            <Select
              size="sm"
              value={filtroEstado}
              onChange={(evento) => setFiltroEstado(evento.target.value)}
              options={FILTROS_ESTADO}
              placeholder="Todos los estados"
              aria-label="Filtrar por estado de la cuenta"
            />
          </>
        }
      />

      <div className={styles.contenido}>
        <TablaCuentasBancarias
          filas={tabla.filasVisibles}
          loading={cargandoBancos || cargandoCuentas || cargandoPersonas || guardando}
          error={errorBancos || errorCuentas}
          onRetry={recargar}
          onEditar={abrirEditar}
          onEliminar={setConfirmacion}
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
        titulo={modal.registro ? 'Editar cuenta bancaria' : 'Nueva cuenta bancaria'}
        descripcion="Completa los datos para registrar o actualizar la cuenta bancaria."
        size="md"
      >
        <div className={styles.formulario}>
          <CuentaBancariaForm
            key={modal.registro?.id ?? 'nueva'}
            initialData={modal.registro ?? undefined}
            bancos={bancos}
            personas={personas}
            onSubmit={guardar}
            onCancel={cerrarModal}
            loading={guardando}
            submitLabel={modal.registro ? 'Guardar cambios' : 'Registrar cuenta'}
          />
        </div>
      </Modal>

      <ConfirmDialog
        abierto={Boolean(confirmacion)}
        titulo="¿Eliminar cuenta bancaria?"
        mensaje={`Se eliminará la cuenta ${
          confirmacion?.nro_cuenta ?? confirmacion?.numero_cuenta ?? ''
        }. Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar"
        variante="peligro"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setConfirmacion(null)}
      />
    </div>
  );
}
