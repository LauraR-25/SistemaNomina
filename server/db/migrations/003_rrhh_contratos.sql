CREATE TABLE cargo (
  id SERIAL PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES empresa(id),
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(200),
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_cargo_empresa_id ON cargo(empresa_id);

CREATE TABLE contrato (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresa(id),
  persona_id UUID NOT NULL REFERENCES persona(id),
  cargo_id INT NOT NULL REFERENCES cargo(id),
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  tipo_pago tipo_pago NOT NULL,
  frecuencia_pago frecuencia_pago NOT NULL,
  horas_semanales NUMERIC(5,2),
  estado estado_contrato NOT NULL DEFAULT 'VIGENTE',
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT chk_contrato_fechas CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio)
);

CREATE INDEX idx_contrato_empresa_id ON contrato(empresa_id);
CREATE INDEX idx_contrato_persona_id ON contrato(persona_id);
CREATE INDEX idx_contrato_cargo_id ON contrato(cargo_id);

CREATE TABLE contrato_salario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contrato_id UUID NOT NULL REFERENCES contrato(id),
  monto NUMERIC(14,2) NOT NULL,
  vigente_desde DATE NOT NULL,
  vigente_hasta DATE,
  motivo VARCHAR(150),
  CONSTRAINT chk_contrato_salario_monto CHECK (monto >= 0),
  CONSTRAINT chk_contrato_salario_vigencia CHECK (vigente_hasta IS NULL OR vigente_hasta >= vigente_desde)
);

CREATE INDEX idx_contrato_salario_contrato_id ON contrato_salario(contrato_id);