CREATE TYPE naturaleza_concepto AS ENUM (
  'CREDITO',
  'DEBITO'
);

CREATE TYPE tipo_valor AS ENUM (
  'MONTO_FIJO',
  'PORCENTAJE_SALDO'
);

CREATE TYPE modalidad_descuento AS ENUM (
  'PORCENTAJE_SALARIO',
  'PORCENTAJE_SALDO',
  'CUOTA_FIJA'
);

CREATE TYPE estado_ejecucion AS ENUM (
  'CALCULADA',
  'DESCARTADA',
  'APROBADA'
);

CREATE TYPE tipo_hora AS ENUM (
  'ORDINARIA',
  'EXTRA'
);

CREATE TYPE estado_registro_horas AS ENUM (
  'PENDIENTE',
  'APROBADO',
  'RECHAZADO',
  'PROCESADO'
);

CREATE TYPE sexo AS ENUM (
  'M',
  'F'
);

CREATE TYPE estado_civil AS ENUM (
  'SOLTERO',
  'CASADO',
  'DIVORCIADO',
  'VIUDO',
  'CONCUBINO'
);

CREATE TYPE estado_persona AS ENUM (
  'ACTIVO',
  'INACTIVO'
);

CREATE TYPE tipo_pago AS ENUM (
  'POR_HORA',
  'SALARIO_FIJO'
);

CREATE TYPE frecuencia_pago AS ENUM (
  'SEMANAL',
  'QUINCENAL',
  'MENSUAL'
);

CREATE TYPE estado_contrato AS ENUM (
  'VIGENTE',
  'SUSPENDIDO',
  'FINALIZADO'
);

CREATE TYPE tipo_cuenta AS ENUM (
  'AHORRO',
  'CORRIENTE'
);

CREATE TYPE estado_periodo AS ENUM (
  'BORRADOR',
  'PRENOMINA',
  'PROCESADO',
  'PAGADO',
  'ANULADO'
);

CREATE TYPE estado_recibo AS ENUM (
  'PENDIENTE',
  'PAGADO',
  'ANULADO'
);

CREATE TYPE metodo_pago AS ENUM (
  'TRANSFERENCIA',
  'PAGO_MOVIL',
  'EFECTIVO',
  'CHEQUE'
);

CREATE TYPE tipo_concepto AS ENUM (
  'ASIGNACION',
  'DEDUCCION',
  'APORTE_PATRONAL'
);

CREATE TYPE categoria_concepto AS ENUM (
  'LEY',
  'OPCIONAL',
  'BONO',
  'PRESTAMO',
  'HORA_EXTRA',
  'AJUSTE',
  'SALARIO_BASE'
);

CREATE TYPE unidad_concepto AS ENUM (
  'HORAS',
  'DIAS',
  'MONTO'
);

CREATE TYPE estado_novedad AS ENUM (
  'PENDIENTE',
  'APROBADA',
  'RECHAZADA',
  'APLICADA'
);

CREATE TYPE estado_prestamo AS ENUM (
  'SOLICITADO',
  'ACTIVO',
  'PAGADO',
  'ANULADO'
);

CREATE TYPE estado_cuota AS ENUM (
  'PENDIENTE',
  'DESCONTADA',
  'CONDONADA'
);

CREATE TYPE estado_afiliacion AS ENUM (
  'ACTIVO',
  'SUSPENDIDO',
  'BAJA'
);