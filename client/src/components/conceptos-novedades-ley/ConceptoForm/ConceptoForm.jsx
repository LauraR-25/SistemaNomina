import { useState } from 'react';
import { Button } from '../../common/ui/Button/index.js';
import { Checkbox } from '../../common/forms/Checkbox/index.js';
import { FormField } from '../../common/forms/FormField/index.js';
import { Input } from '../../common/forms/Input/index.js';
import { Select } from '../../common/forms/Select/index.js';
import {
  CATEGORIAS_CONCEPTO,
  NATURALEZAS_CONCEPTO,
  TIPOS_CONCEPTO,
  UNIDADES_CONCEPTO,
  crearEstadoConcepto,
  prepararPayloadConcepto,
} from './conceptoForm.model.js';
import styles from './ConceptoForm.module.css';

export function ConceptoForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Guardar',
}) {
  const [estado, setEstado] = useState(() =>
    crearEstadoConcepto(initialData ?? {})
  );

  function actualizar(campo, valor) {
    setEstado((actual) => ({ ...actual, [campo]: valor }));
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    onSubmit?.(prepararPayloadConcepto(estado), estado);
  }

  return (
    <form className={styles.formulario} onSubmit={manejarEnvio}>
      <FormField label="Código" required>
        <Input
          name="codigo"
          value={estado.codigo}
          onChange={(evento) => actualizar('codigo', evento.target.value)}
          placeholder="Ej. SAL_BASE"
          maxLength={30}
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Nombre" required>
        <Input
          name="nombre"
          value={estado.nombre}
          onChange={(evento) => actualizar('nombre', evento.target.value)}
          placeholder="Nombre del concepto"
          maxLength={120}
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Tipo de concepto" required>
        <Select
          name="tipo_concepto"
          value={estado.tipo_concepto}
          onChange={(evento) => actualizar('tipo_concepto', evento.target.value)}
          options={TIPOS_CONCEPTO}
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Categoría" required>
        <Select
          name="categoria"
          value={estado.categoria}
          onChange={(evento) => actualizar('categoria', evento.target.value)}
          options={CATEGORIAS_CONCEPTO}
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Naturaleza" required>
        <Select
          name="naturaleza"
          value={estado.naturaleza}
          onChange={(evento) => actualizar('naturaleza', evento.target.value)}
          options={NATURALEZAS_CONCEPTO}
          required
          disabled={loading}
        />
      </FormField>

      <FormField label="Unidad" required>
        <Select
          name="unidad"
          value={estado.unidad}
          onChange={(evento) => actualizar('unidad', evento.target.value)}
          options={UNIDADES_CONCEPTO}
          required
          disabled={loading}
        />
      </FormField>

      <div className={styles.opciones}>
        <Checkbox
          name="es_fijo"
          checked={Boolean(estado.es_fijo)}
          onChange={(evento) => actualizar('es_fijo', evento.target.checked)}
          disabled={loading}
        >
          Es fijo
        </Checkbox>
        <Checkbox
          name="es_imponible"
          checked={Boolean(estado.es_imponible)}
          onChange={(evento) => actualizar('es_imponible', evento.target.checked)}
          disabled={loading}
        >
          Es imponible
        </Checkbox>
        <Checkbox
          name="activo"
          checked={estado.activo !== false}
          onChange={(evento) => actualizar('activo', evento.target.checked)}
          disabled={loading}
        >
          Activo
        </Checkbox>
      </div>

      <div className={styles.acciones}>
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default ConceptoForm;
