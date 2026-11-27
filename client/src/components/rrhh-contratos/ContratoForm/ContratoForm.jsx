import { useState } from 'react';
import { Button } from '../../common/ui/Button/index.js';
import { DateInput } from '../../common/forms/DateInput/index.js';
import { FormField } from '../../common/forms/FormField/index.js';
import { Input } from '../../common/forms/Input/index.js';
import { Select } from '../../common/forms/Select/index.js';
import { crearEstadoContrato, prepararPayloadContrato } from './contratoForm.model.js';
import styles from './ContratoForm.module.css';

const TIPOS_PAGO = [{ value: 'POR_HORA', label: 'Por hora' }, { value: 'SALARIO_FIJO', label: 'Salario fijo' }];
const FRECUENCIAS = [{ value: 'SEMANAL', label: 'Semanal' }, { value: 'QUINCENAL', label: 'Quincenal' }, { value: 'MENSUAL', label: 'Mensual' }];
const ESTADOS = [{ value: 'VIGENTE', label: 'Vigente' }, { value: 'SUSPENDIDO', label: 'Suspendido' }, { value: 'FINALIZADO', label: 'Finalizado' }];

function nombrePersona(persona) { return [persona.primer_nombre, persona.primer_apellido].filter(Boolean).join(' '); }

export function ContratoForm({ initialData, cargos = [], personas = [], onSubmit, onCancel, loading = false, submitLabel = 'Guardar', modo = 'crear' }) {
  const [estado, setEstado] = useState(() => crearEstadoContrato(initialData ?? {}));
  const esEdicion = modo === 'editar' || Boolean(initialData?.id);

  function actualizar(campo, valor) { setEstado((actual) => ({ ...actual, [campo]: valor })); }
  function cambiarCargo(e) { const id = e.target.value; const cargo = cargos.find((c) => String(c.id) === String(id)); setEstado((a) => ({ ...a, cargo_id: id, cargo: cargo?.nombre ?? '' })); }
  function cambiarFechaInicio(valor) { setEstado((a) => ({ ...a, fecha_inicio: valor, fecha_ingreso: valor })); }
  function manejarEnvio(e) { e.preventDefault(); onSubmit?.(prepararPayloadContrato(estado), estado); }

  return (
    <form className={styles.formulario} onSubmit={manejarEnvio}>
      <FormField label="Persona" required className={styles.completo}>
        {personas.length > 0 ? (
          <Select name="persona_id" value={String(estado.persona_id ?? '')} onChange={(e) => actualizar('persona_id', e.target.value)} options={personas.map((p) => ({ value: String(p.id), label: `${nombrePersona(p)} - ${p.cedula ?? ''}` }))} placeholder="Seleccione una persona" required disabled={loading} />
        ) : <div className={styles.aviso}>No hay personas disponibles. Crea una persona antes de registrar contratos.</div>}
      </FormField>

      <FormField label="Cargo" required>
        {cargos.length > 0 ? (
          <Select name="cargo_id" value={String(estado.cargo_id ?? '')} onChange={cambiarCargo} options={cargos.map((c) => ({ value: String(c.id), label: c.nombre }))} placeholder="Seleccione un cargo" required disabled={loading} />
        ) : <div className={styles.aviso}>No hay cargos disponibles. Crea un cargo antes de registrar contratos.</div>}
      </FormField>

      <FormField label="Estado">
        <Select name="estado" value={estado.estado} onChange={(e) => actualizar('estado', e.target.value)} options={ESTADOS} disabled={loading} />
      </FormField>
      <FormField label="Fecha de inicio" required>
        <DateInput name="fecha_inicio" value={estado.fecha_inicio} onChange={(e) => cambiarFechaInicio(e.target.value)} required disabled={loading} />
      </FormField>
      <FormField label="Fecha de fin">
        <DateInput name="fecha_fin" value={estado.fecha_fin} onChange={(e) => actualizar('fecha_fin', e.target.value)} disabled={loading} />
      </FormField>
      <FormField label="Tipo de pago" required>
        <Select name="tipo_pago" value={estado.tipo_pago} onChange={(e) => actualizar('tipo_pago', e.target.value)} options={TIPOS_PAGO} required disabled={loading || esEdicion} />
      </FormField>
      <FormField label="Frecuencia de pago" required>
        <Select name="frecuencia_pago" value={estado.frecuencia_pago} onChange={(e) => actualizar('frecuencia_pago', e.target.value)} options={FRECUENCIAS} required disabled={loading || esEdicion} />
      </FormField>
      <FormField label="Horas semanales" hint="Opcional, según esquema del contrato.">
        <Input name="horas_semanales" type="number" min="0" step="0.25" value={estado.horas_semanales} onChange={(e) => actualizar('horas_semanales', e.target.value)} placeholder="40" disabled={loading} />
      </FormField>
      {!esEdicion && (
        <FormField label="Salario inicial" required>
          <Input name="salario_base" type="number" min="0" step="0.01" value={estado.salario_base} onChange={(e) => actualizar('salario_base', e.target.value)} placeholder="0.00" required disabled={loading} />
        </FormField>
      )}
      <div className={styles.acciones}>
        <Button variant="secondary" onClick={onCancel} disabled={loading}>Cancelar</Button>
        <Button type="submit" loading={loading} disabled={loading || !personas.length || !cargos.length}>{submitLabel}</Button>
      </div>
    </form>
  );
}
