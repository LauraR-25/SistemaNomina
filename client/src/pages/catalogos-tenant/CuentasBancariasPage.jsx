import { useEffect, useMemo, useState } from 'react';
import { CuentaBancariaForm } from '../../components/catalogos-tenant/CuentaBancariaForm/index.js';
import { TablaCuentasBancarias } from '../../components/catalogos-tenant/TablaCuentasBancarias/index.js';
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
import { useCatalogos } from '../../hooks/catalogos-tenant/useCatalogos.js';
import { useNotificacion } from '../../hooks/ui/useNotificacion.js';
import { useTablaControles } from '../../hooks/ui/useTablaControles.js';
import {
  actualizarCuentaBancariaModelo,
  agregarCuentaBancariaModelo,
  crearModeloCuentasBancariasPage,
  eliminarCuentaBancariaModelo,
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
  const { bancos, loading, error, cargarCatalogos } = useCatalogos();
  const [modelo, setModelo] = useState(() => crearModeloCuentasBancariasPage());
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [modal, setModal] = useState({ abierto: false, registro: null });
  const [confirmacion, setConfirmacion] = useState(null);

  useEffect(() => {
    cargarCatalogos();
  }, [cargarCatalogos]);

  const registros = useMemo(() => {
    const cuentas = modelo.cuentas.map((cuenta) => ({
      ...cuenta,
      banco:
        bancos.find((banco) => String(banco.id) === String(cuenta.banco_id)) ??
        null,
    }));

    return cuentas.filter((cuenta) => {
      const porTipo = !filtroTipo || cuenta.tipo_cuenta === filtroTipo;
      const porEstado =
        !filtroEstado ||
        (filtroEstado === 'ACTIVA'
          ? cuenta.activa !== false
          : cuenta.activa === false);

      return porTipo && porEstado;
    });
  }, [bancos, filtroEstado, filtroTipo, modelo.cuentas]);

  const tabla = useTablaControles(registros, {
    campos: [
      'banco.nombre',
      'nro_cuenta',
      'numero_cuenta',
      'tipo_cuenta',
      'titular',
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

  function guardar(datos) {
    if (modal.registro) {
      setModelo((actual) =>
        actualizarCuentaBancariaModelo(actual, {
          ...datos,
          id: modal.registro.id,
        })
      );
    } else {
      setModelo((actual) => agregarCuentaBancariaModelo(actual, datos));
    }

    cerrarModal();
    notificar({
      tipo: 'info',
      titulo: 'Cambio registrado localmente',
      mensaje: 'El endpoint de cuentas bancarias aún está pendiente.',
    });
  }

  function confirmarEliminacion() {
    setModelo((actual) =>
      eliminarCuentaBancariaModelo(actual, confirmacion.id)
    );
    setConfirmacion(null);
    notificar({
      tipo: 'info',
      titulo: 'Cuenta eliminada localmente',
      mensaje: 'El endpoint de cuentas bancarias aún está pendiente.',
    });
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
        badge={{ etiqueta: 'Pendiente', variante: 'warning' }}
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
          loading={loading}
          error={error}
          onRetry={cargarCatalogos}
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
        descripcion="El registro se guardará localmente hasta que el endpoint esté disponible."
        size="md"
      >
        <div className={styles.formulario}>
          <Badge variant="warning" size="sm">
            Endpoint pendiente
          </Badge>
          <CuentaBancariaForm
            key={modal.registro?.id ?? 'nueva'}
            initialData={modal.registro ?? undefined}
            bancos={bancos}
            onSubmit={guardar}
            onCancel={cerrarModal}
            submitLabel={modal.registro ? 'Guardar cambios' : 'Registrar cuenta'}
          />
        </div>
      </Modal>

      <ConfirmDialog
        abierto={Boolean(confirmacion)}
        titulo="¿Eliminar cuenta bancaria?"
        mensaje={`Se eliminará la cuenta ${
          confirmacion?.nro_cuenta ?? confirmacion?.numero_cuenta ?? ''
        } del listado local.`}
        textoConfirmar="Eliminar"
        variante="peligro"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setConfirmacion(null)}
      />
    </div>
  );
}
