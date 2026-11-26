import { useEffect, useMemo, useState } from 'react';
import { AfiliacionLeyForm } from '../../components/conceptos-novedades-ley/AfiliacionLeyForm/index.js';
import { TablaAfiliaciones } from '../../components/conceptos-novedades-ley/TablaAfiliaciones/index.js';
import {
  Badge,
  Button,
  ConfirmDialog,
  DataTable,
  Modal,
  PageHeader,
  Pagination,
  SearchInput,
  StatusBadge,
  Tabs,
  Toolbar,
} from '../../components/common/index.js';
import { useAuth } from '../../hooks/auth-rbac/useAuth.js';
import { usePersonas } from '../../hooks/rrhh-contratos/usePersonas.js';
import { useNotificacion } from '../../hooks/ui/useNotificacion.js';
import { useTablaControles } from '../../hooks/ui/useTablaControles.js';
import {
  actualizarAfiliacionLeyModelo,
  agregarAfiliacionLeyModelo,
  crearModeloAportesLeyPage,
  eliminarAfiliacionLeyModelo,
} from './aportesLeyPage.model.js';
import styles from './AportesLeyPage.module.css';

export {
  crearModeloAportesLeyPage,
  agregarAfiliacionLeyModelo,
} from './aportesLeyPage.model.js';

const PESTANAS = [
  { id: 'tipos', label: 'Tipos de aporte', icon: 'shield' },
  { id: 'parametros', label: 'Parámetros vigentes', icon: 'settings' },
  { id: 'afiliaciones', label: 'Afiliaciones', icon: 'users' },
];

export function AportesLeyPage({ onNavegar }) {
  const { notificar } = useNotificacion();
  const { empresa } = useAuth();
  const { personas, cargarPersonas } = usePersonas(empresa?.id);
  const [modelo, setModelo] = useState(() => crearModeloAportesLeyPage());
  const [pestana, setPestana] = useState('tipos');
  const [modal, setModal] = useState({ abierto: false, registro: null });
  const [confirmacion, setConfirmacion] = useState(null);

  useEffect(() => {
    cargarPersonas();
  }, [cargarPersonas]);

  const esAfiliaciones = pestana === 'afiliaciones';

  const filas = useMemo(() => {
    if (pestana === 'afiliaciones') return modelo.afiliaciones;
    if (pestana === 'parametros') return modelo.parametrosAporte;
    return modelo.tiposAporte;
  }, [modelo, pestana]);

  const tabla = useTablaControles(filas, {
    campos:
      pestana === 'afiliaciones'
        ? ['nro_afiliacion', 'persona_id', 'tipo_aporte_id', 'estado']
        : pestana === 'parametros'
          ? ['tipo', 'vigente_desde', 'porcentaje_empleado', 'porcentaje_patronal']
          : ['codigo', 'nombre', 'activo'],
  });

  function cambiarPestana(id) {
    setPestana(id);
    tabla.setPagina(1);
    tabla.setBusqueda('');
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

  function guardar(datos) {
    if (modal.registro) {
      setModelo((actual) =>
        actualizarAfiliacionLeyModelo(actual, {
          ...datos,
          id: modal.registro.id,
        })
      );
      cerrarModal();
      notificar({
        tipo: 'info',
        titulo: 'Afiliación actualizada localmente',
        mensaje: 'El endpoint de aportes de ley aún está pendiente.',
      });
      return;
    }

    setModelo((actual) => agregarAfiliacionLeyModelo(actual, datos));
    cerrarModal();
    notificar({
      tipo: 'info',
      titulo: 'Afiliación registrada localmente',
      mensaje: 'El endpoint de aportes de ley aún está pendiente.',
    });
  }

  function confirmarEliminacion() {
    setModelo((actual) =>
      eliminarAfiliacionLeyModelo(actual, confirmacion.id)
    );
    setConfirmacion(null);
    notificar({
      tipo: 'info',
      titulo: 'Afiliación eliminada localmente',
      mensaje: 'El endpoint de aportes de ley aún está pendiente.',
    });
  }

  const columnasCatalogo =
    pestana === 'parametros'
      ? [
          {
            key: 'tipo',
            header: 'Aporte',
            sortable: true,
            render: (valor) => valor ?? '—',
          },
          {
            key: 'vigente_desde',
            header: 'Vigente desde',
            sortable: true,
            render: (valor) => valor ?? '—',
          },
          {
            key: 'porcentaje_empleado',
            header: 'Empleado',
            align: 'right',
            sortable: true,
            render: (valor) => `${valor ?? 0}%`,
          },
          {
            key: 'porcentaje_patronal',
            header: 'Patronal',
            align: 'right',
            sortable: true,
            render: (valor) => `${valor ?? 0}%`,
          },
          {
            key: 'activo',
            header: 'Estado',
            sortable: true,
            render: (valor) => (
              <StatusBadge estado={valor ? 'ACTIVO' : 'BAJA'} size="sm" />
            ),
          },
        ]
      : [
          {
            key: 'codigo',
            header: 'Código',
            sortable: true,
            render: (valor) => (
              <Badge variant="accent" size="sm">
                {valor ?? '—'}
              </Badge>
            ),
          },
          {
            key: 'nombre',
            header: 'Nombre',
            sortable: true,
          },
          {
            key: 'activo',
            header: 'Estado',
            sortable: true,
            render: (valor) => (
              <StatusBadge estado={valor ? 'ACTIVO' : 'BAJA'} size="sm" />
            ),
          },
        ];

  return (
    <div className={styles.pagina}>
      <PageHeader
        titulo={modelo.titulo}
        descripcion="Administra tipos de aporte, parámetros vigentes y afiliaciones de ley del personal."
        breadcrumbs={[
          {
            label: 'Conceptos',
            onClick: onNavegar ? () => onNavegar('/conceptos') : undefined,
          },
          { label: 'Aportes y afiliaciones de ley' },
        ]}
        badge={{ etiqueta: 'Pendiente', variante: 'warning' }}
        actions={
          esAfiliaciones ? (
            <Button iconLeft="plus" onClick={abrirNuevo}>
              Nueva afiliación
            </Button>
          ) : undefined
        }
      />

      <Tabs
        tabs={PESTANAS.map((tab) => ({
          ...tab,
          badge:
            tab.id === 'afiliaciones'
              ? modelo.afiliaciones.length
              : tab.id === 'parametros'
                ? modelo.parametrosAporte.length
                : modelo.tiposAporte.length,
        }))}
        activeId={pestana}
        onChange={cambiarPestana}
        ariaLabel="Secciones de aportes de ley"
        className={styles.pestanas}
      />

      <Toolbar
        search={
          <SearchInput
            value={tabla.busqueda}
            onValueChange={tabla.setBusqueda}
            placeholder={
              esAfiliaciones
                ? 'Buscar por persona, número o estado'
                : 'Buscar por código, nombre o porcentaje'
            }
            ariaLabel="Buscar registros de aportes"
          />
        }
      />

      <div className={styles.contenido}>
        {esAfiliaciones ? (
          <TablaAfiliaciones
            filas={tabla.filasVisibles}
            personas={personas}
            tiposAporte={modelo.tiposAporte}
            onEditar={abrirEditar}
            onEliminar={setConfirmacion}
            orden={{ key: tabla.orden.campo, dir: tabla.orden.direccion }}
            onSort={({ key }) => tabla.cambiarOrden(key)}
          />
        ) : (
          <DataTable
            datos={tabla.filasVisibles}
            columnas={columnasCatalogo}
            orden={{ key: tabla.orden.campo, dir: tabla.orden.direccion }}
            onSort={({ key }) => tabla.cambiarOrden(key)}
            emptyTitle="Sin registros"
            emptyMessage="No hay datos disponibles en esta sección."
            ariaLabel="Listado de aportes de ley"
          />
        )}

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
        titulo={modal.registro ? 'Editar afiliación' : 'Nueva afiliación'}
        descripcion="El registro se guardará localmente hasta que el endpoint esté disponible."
        size="lg"
      >
        <div className={styles.formulario}>
          <Badge variant="warning" size="sm">
            Endpoint pendiente
          </Badge>
          <AfiliacionLeyForm
            key={modal.registro?.id ?? 'nueva'}
            initialData={modal.registro ?? undefined}
            personas={personas}
            tiposAporte={modelo.tiposAporte}
            onSubmit={guardar}
            onCancel={cerrarModal}
            submitLabel={modal.registro ? 'Guardar cambios' : 'Registrar afiliación'}
          />
        </div>
      </Modal>

      <ConfirmDialog
        abierto={Boolean(confirmacion)}
        titulo="¿Eliminar afiliación?"
        mensaje="La afiliación se eliminará del listado local."
        textoConfirmar="Eliminar"
        variante="peligro"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setConfirmacion(null)}
      />
    </div>
  );
}

export default AportesLeyPage;
