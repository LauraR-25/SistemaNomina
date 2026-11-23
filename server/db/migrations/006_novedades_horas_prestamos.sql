CREATE TABLE novedad (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresa(id),
  contrato_id UUID NOT NULL REFERENCES contrato(id),
  concepto_id UUID NOT NULL REFERENCES concepto(id),
  periodo_id UUID REFERENCES periodo_nomina(id),
  cantidad NUMERIC(12,2) NOT NULL DEFAULT 1,
  monto_unitario NUMERIC(14,2) NOT NULL DEFAULT 0,
  monto_total NUMERIC(14,2) NOT NULL DEFAULT 0,
  fecha_novedad DATE NOT NULL,
  observacion VARCHAR(250),
  estado estado_novedad NOT NULL DEFAULT 'PENDIENTE',
  registrado_por UUID REFERENCES usuario(id),
  aprobado_por UUID REFERENCES usuario(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT chk_novedad_cantidad CHECK (cantidad > 0),
  CONSTRAINT chk_novedad_monto_unitario CHECK (monto_unitario >= 0),
  CONSTRAINT chk_novedad_monto_total CHECK (monto_total >= 0)
);

CREATE INDEX idx_novedad_empresa_id ON novedad(empresa_id);
CREATE INDEX idx_novedad_contrato_id ON novedad(contrato_id);
CREATE INDEX idx_novedad_concepto_id ON novedad(concepto_id);
CREATE INDEX idx_novedad_periodo_id ON novedad(periodo_id);
CREATE INDEX idx_novedad_registrado_por ON novedad(registrado_por);
CREATE INDEX idx_novedad_aprobado_por ON novedad(aprobado_por);

CREATE TABLE registro_horas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresa(id),
  contrato_id UUID NOT NULL REFERENCES contrato(id),
  periodo_id UUID REFERENCES periodo_nomina(id),
  fecha DATE NOT NULL,
  tipo_hora tipo_hora NOT NULL,
  horas NUMERIC(6,2) NOT NULL,
  factor_recargo NUMERIC(6,4) NOT NULL DEFAULT 1.0000,
  descripcion VARCHAR(200),
  estado estado_registro_horas NOT NULL DEFAULT 'PENDIENTE',
  registrado_por UUID REFERENCES usuario(id),
  aprobado_por UUID REFERENCES usuario(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT chk_registro_horas_cantidad CHECK (horas > 0),
  CONSTRAINT chk_registro_horas_factor CHECK (factor_recargo > 0)
);

CREATE INDEX idx_registro_horas_empresa_id ON registro_horas(empresa_id);
CREATE INDEX idx_registro_horas_contrato_id ON registro_horas(contrato_id);
CREATE INDEX idx_registro_horas_periodo_id ON registro_horas(periodo_id);
CREATE INDEX idx_registro_horas_registrado_por ON registro_horas(registrado_por);
CREATE INDEX idx_registro_horas_aprobado_por ON registro_horas(aprobado_por);

CREATE TABLE prestamo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresa(id),
  contrato_id UUID NOT NULL REFERENCES contrato(id),
  concepto_id UUID NOT NULL REFERENCES concepto(id),
  monto_aprobado NUMERIC(14,2) NOT NULL,
  saldo_pendiente NUMERIC(14,2) NOT NULL,
  nro_cuotas SMALLINT NOT NULL,
  modalidad_descuento modalidad_descuento NOT NULL,
  valor_cuota NUMERIC(14,2) NOT NULL,
  fecha_aprobacion DATE NOT NULL,
  fecha_inicio_descuento DATE NOT NULL,
  estado estado_prestamo NOT NULL DEFAULT 'SOLICITADO',
  observacion VARCHAR(250),
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT chk_prestamo_monto_aprobado CHECK (monto_aprobado > 0),
  CONSTRAINT chk_prestamo_saldo_pendiente CHECK (saldo_pendiente >= 0),
  CONSTRAINT chk_prestamo_nro_cuotas CHECK (nro_cuotas > 0),
  CONSTRAINT chk_prestamo_valor_cuota CHECK (valor_cuota >= 0)
);

CREATE INDEX idx_prestamo_empresa_id ON prestamo(empresa_id);
CREATE INDEX idx_prestamo_contrato_id ON prestamo(contrato_id);
CREATE INDEX idx_prestamo_concepto_id ON prestamo(concepto_id);

CREATE TABLE cuota_prestamo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prestamo_id UUID NOT NULL REFERENCES prestamo(id),
  nro_cuota SMALLINT NOT NULL,
  periodo_id UUID REFERENCES periodo_nomina(id),
  fecha_vencimiento DATE NOT NULL,
  monto_cuota NUMERIC(14,2) NOT NULL,
  monto_descontado NUMERIC(14,2) NOT NULL DEFAULT 0,
  estado estado_cuota NOT NULL DEFAULT 'PENDIENTE',
  CONSTRAINT uq_cuota_prestamo_numero UNIQUE (prestamo_id, nro_cuota),
  CONSTRAINT chk_cuota_prestamo_numero CHECK (nro_cuota > 0),
  CONSTRAINT chk_cuota_prestamo_monto CHECK (monto_cuota >= 0),
  CONSTRAINT chk_cuota_prestamo_descontado CHECK (monto_descontado >= 0)
);

CREATE INDEX idx_cuota_prestamo_prestamo_id ON cuota_prestamo(prestamo_id);
CREATE INDEX idx_cuota_prestamo_periodo_id ON cuota_prestamo(periodo_id);