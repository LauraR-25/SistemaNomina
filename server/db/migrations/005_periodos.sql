CREATE TABLE periodo_nomina (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresa(id),
  frecuencia frecuencia_pago NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  fecha_pago DATE,
  estado estado_periodo NOT NULL DEFAULT 'BORRADOR',
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT chk_periodo_nomina_fechas CHECK (fecha_fin >= fecha_inicio),
  CONSTRAINT chk_periodo_nomina_pago CHECK (fecha_pago IS NULL OR fecha_pago >= fecha_inicio)
);

CREATE INDEX idx_periodo_nomina_empresa_id ON periodo_nomina(empresa_id);