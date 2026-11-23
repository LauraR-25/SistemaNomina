CREATE TABLE ejecucion_prenomina (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresa(id),
  periodo_id UUID NOT NULL REFERENCES periodo_nomina(id),
  numero_ejecucion INT NOT NULL DEFAULT 1,
  estado estado_ejecucion NOT NULL DEFAULT 'CALCULADA',
  observacion VARCHAR(250),
  calculado_por UUID REFERENCES usuario(id),
  aprobado_por UUID REFERENCES usuario(id),
  fecha_calculo TIMESTAMPTZ DEFAULT now(),
  fecha_aprobacion TIMESTAMPTZ,
  CONSTRAINT uq_ejecucion_prenomina_periodo_nro UNIQUE (periodo_id, numero_ejecucion),
  CONSTRAINT chk_ejecucion_prenomina_nro CHECK (numero_ejecucion > 0)
);

CREATE INDEX idx_ejecucion_prenomina_empresa_id ON ejecucion_prenomina(empresa_id);
CREATE INDEX idx_ejecucion_prenomina_periodo_id ON ejecucion_prenomina(periodo_id);
CREATE INDEX idx_ejecucion_prenomina_calculado_por ON ejecucion_prenomina(calculado_por);
CREATE INDEX idx_ejecucion_prenomina_aprobado_por ON ejecucion_prenomina(aprobado_por);

CREATE TABLE resultado_prenomina (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ejecucion_id UUID NOT NULL REFERENCES ejecucion_prenomina(id),
  contrato_id UUID NOT NULL REFERENCES contrato(id),
  salario_base_periodo NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_asignaciones NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_deducciones NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_aportes_patronales NUMERIC(14,2) NOT NULL DEFAULT 0,
  neto_a_pagar NUMERIC(14,2) NOT NULL DEFAULT 0,
  observacion VARCHAR(250),
  CONSTRAINT uq_resultado_prenomina_ejecucion_contrato UNIQUE (ejecucion_id, contrato_id),
  CONSTRAINT chk_resultado_prenomina_salario CHECK (salario_base_periodo >= 0),
  CONSTRAINT chk_resultado_prenomina_asignaciones CHECK (total_asignaciones >= 0),
  CONSTRAINT chk_resultado_prenomina_deducciones CHECK (total_deducciones >= 0),
  CONSTRAINT chk_resultado_prenomina_aportes CHECK (total_aportes_patronales >= 0),
  CONSTRAINT chk_resultado_prenomina_neto CHECK (neto_a_pagar >= 0)
);

CREATE INDEX idx_resultado_prenomina_ejecucion_id ON resultado_prenomina(ejecucion_id);
CREATE INDEX idx_resultado_prenomina_contrato_id ON resultado_prenomina(contrato_id);

CREATE TABLE detalle_prenomina (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resultado_id UUID NOT NULL REFERENCES resultado_prenomina(id),
  concepto_id UUID NOT NULL REFERENCES concepto(id),
  naturaleza naturaleza_concepto NOT NULL,
  cantidad NUMERIC(12,2) NOT NULL DEFAULT 1,
  monto_unitario NUMERIC(14,2) NOT NULL DEFAULT 0,
  monto_total NUMERIC(14,2) NOT NULL DEFAULT 0,
  origen VARCHAR(50),
  cuota_prestamo_id UUID REFERENCES cuota_prestamo(id),
  CONSTRAINT chk_detalle_prenomina_cantidad CHECK (cantidad >= 0),
  CONSTRAINT chk_detalle_prenomina_unitario CHECK (monto_unitario >= 0),
  CONSTRAINT chk_detalle_prenomina_total CHECK (monto_total >= 0)
);

CREATE INDEX idx_detalle_prenomina_resultado_id ON detalle_prenomina(resultado_id);
CREATE INDEX idx_detalle_prenomina_concepto_id ON detalle_prenomina(concepto_id);
CREATE INDEX idx_detalle_prenomina_cuota_prestamo_id ON detalle_prenomina(cuota_prestamo_id);

CREATE TABLE recibo_pago (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresa(id),
  periodo_id UUID NOT NULL REFERENCES periodo_nomina(id),
  contrato_id UUID NOT NULL REFERENCES contrato(id),
  ejecucion_id UUID REFERENCES ejecucion_prenomina(id),
  total_asignaciones NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_deducciones NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_aportes_patronales NUMERIC(14,2) NOT NULL DEFAULT 0,
  neto_pagar NUMERIC(14,2) NOT NULL DEFAULT 0,
  metodo_pago metodo_pago,
  referencia_pago VARCHAR(100),
  fecha_pago TIMESTAMPTZ,
  estado estado_recibo NOT NULL DEFAULT 'PENDIENTE',
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_recibo_pago_periodo_contrato UNIQUE (periodo_id, contrato_id),
  CONSTRAINT chk_recibo_pago_asignaciones CHECK (total_asignaciones >= 0),
  CONSTRAINT chk_recibo_pago_deducciones CHECK (total_deducciones >= 0),
  CONSTRAINT chk_recibo_pago_aportes CHECK (total_aportes_patronales >= 0),
  CONSTRAINT chk_recibo_pago_neto CHECK (neto_pagar >= 0)
);

CREATE INDEX idx_recibo_pago_empresa_id ON recibo_pago(empresa_id);
CREATE INDEX idx_recibo_pago_periodo_id ON recibo_pago(periodo_id);
CREATE INDEX idx_recibo_pago_contrato_id ON recibo_pago(contrato_id);
CREATE INDEX idx_recibo_pago_ejecucion_id ON recibo_pago(ejecucion_id);

CREATE TABLE detalle_recibo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recibo_id UUID NOT NULL REFERENCES recibo_pago(id),
  concepto_id UUID NOT NULL REFERENCES concepto(id),
  naturaleza naturaleza_concepto NOT NULL,
  cantidad NUMERIC(12,2) NOT NULL DEFAULT 1,
  monto_unitario NUMERIC(14,2) NOT NULL DEFAULT 0,
  monto_total NUMERIC(14,2) NOT NULL DEFAULT 0,
  cuota_prestamo_id UUID REFERENCES cuota_prestamo(id),
  CONSTRAINT chk_detalle_recibo_cantidad CHECK (cantidad >= 0),
  CONSTRAINT chk_detalle_recibo_unitario CHECK (monto_unitario >= 0),
  CONSTRAINT chk_detalle_recibo_total CHECK (monto_total >= 0)
);

CREATE INDEX idx_detalle_recibo_recibo_id ON detalle_recibo(recibo_id);
CREATE INDEX idx_detalle_recibo_concepto_id ON detalle_recibo(concepto_id);
CREATE INDEX idx_detalle_recibo_cuota_prestamo_id ON detalle_recibo(cuota_prestamo_id);