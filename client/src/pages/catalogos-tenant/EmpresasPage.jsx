import { useEffect, useMemo, useState } from 'react';
import { EmpresaForm } from '../../components/catalogos-tenant/EmpresaForm/index.js';
import { TablaEmpresas } from '../../components/catalogos-tenant/TablaEmpresas/index.js';
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
  crearModeloEmpresasPage,
  registrarEmpresaPage,
} from './empresasPage.model.js';
import styles from './EmpresasPage.module.css';

const MONEDAS = [
  { value: 'VES', label: 'VES' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
];

export function EmpresasPage({ onNavegar }) {
  const { notificar } = useNotificacion();
  const {
    paises,
    empresas,
    loading: cargandoCatalogos,
    error: errorCatalogos,
    cargarCatalogos,
  } = useCatalogos();
  const [modelo, setModelo] = useState(() => crearModeloEmpresasPage());
  const [filtroMoneda, setFiltroMoneda] = useState('');
  const [modal, setModal] = useState({ abierto: false, registro: null });
  const [confirmacion, setConfirmacion] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarCatalogos();
  }, [cargarCatalogos]);

  const registros = useMemo(() => {
    const lista = modelo.empresas.length > 0 ? modelo.empresas : empresas;

    return filtroMoneda
      ? lista.filter((empresa) => empresa.moneda_codigo === filtroMoneda)
      : lista;
  }, [empresas, filtroMoneda, modelo.empresas]);

  const tabla = useTablaControles(registros, {
    campos: ['rif', 'razon_social', 'nombre_comercial', 'moneda_codigo'],
  });

  async function recargar() {
    setModelo((actual) => ({ ...actual, empresas: [] }));
    await cargarCatalogos();
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
    if (modal.registro) {
      notificar({
        tipo: 'info',
        titulo: 'Edición pendiente',
        mensaje: 'El endpoint para actualizar empresas aún no está disponible.',
      });
      cerrarModal();
      return;
    }

    setGuardando(true);

    const siguiente = await registrarEmpresaPage(
      { ...modelo, empresas },
      datos
    );

    setGuardando(false);
    setModelo(siguiente);

    if (siguiente.mensaje?.tipo === 'exito') {
      notificar({
        tipo: 'exito',
        titulo: 'Empresa registrada',
        mensaje: siguiente.mensaje.texto,
      });
      cerrarModal();
      recargar();
      return;
    }

    notificar({
      tipo: 'error',
      titulo: 'No se pudo registrar la empresa',
      mensaje: siguiente.mensaje?.texto,
    });
  }

  function confirmarEliminacion() {
    notificar({
      tipo: 'info',
      titulo: 'Eliminación pendiente',
      mensaje: 'El endpoint para eliminar empresas aún no está disponible.',
    });
    setConfirmacion(null);
  }

  return (
    <div className={styles.pagina}>
      <PageHeader
        titulo={modelo.titulo}
        descripcion="Administra las empresas asociadas a la nómina multiempresa."
        breadcrumbs={[
          {
            label: 'Catálogos',
            onClick: onNavegar ? () => onNavegar('/catalogos') : undefined,
          },
          { label: 'Empresas' },
        ]}
        badge={{ etiqueta: `${registros.length} registros`, variante: 'neutral' }}
        actions={
          <Button iconLeft="plus" onClick={abrirNuevo}>
            Nueva empresa
          </Button>
        }
      />

      <Toolbar
        search={
          <SearchInput
            value={tabla.busqueda}
            onValueChange={tabla.setBusqueda}
            placeholder="Buscar por RIF, razón social o moneda"
            ariaLabel="Buscar empresas"
          />
        }
        filters={
          <Select
            size="sm"
            value={filtroMoneda}
            onChange={(evento) => setFiltroMoneda(evento.target.value)}
            options={MONEDAS}
            placeholder="Todas las monedas"
            aria-label="Filtrar por moneda"
          />
        }
      />

      <div className={styles.contenido}>
        <TablaEmpresas
          filas={tabla.filasVisibles}
          loading={cargandoCatalogos || guardando}
          error={errorCatalogos}
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
        titulo={modal.registro ? 'Editar empresa' : 'Nueva empresa'}
        descripcion={
          modal.registro
            ? 'Actualiza los datos de la empresa seleccionada.'
            : 'Completa los datos para registrar una empresa.'
        }
        size="md"
      >
        <div className={styles.formulario}>
          {modal.registro && (
            <Badge variant="warning" size="sm">
              Edición pendiente de endpoint
            </Badge>
          )}
          <EmpresaForm
            key={modal.registro?.id ?? 'nueva'}
            initialData={modal.registro ?? undefined}
            onSubmit={guardar}
            onCancel={cerrarModal}
            loading={guardando}
            submitLabel={modal.registro ? 'Guardar cambios' : 'Registrar empresa'}
          />
          {paises.length === 0 && (
            <p className={styles.aviso}>
              No se cargaron países; la empresa se creará con el país predeterminado.
            </p>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        abierto={Boolean(confirmacion)}
        titulo="¿Eliminar empresa?"
        mensaje={`Se eliminará "${confirmacion?.razon_social ?? ''}". Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar"
        variante="peligro"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setConfirmacion(null)}
      />
    </div>
  );
}
