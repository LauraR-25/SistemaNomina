CREATE TABLE concepto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresa(id),
  codigo VARCHAR(30) NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  tipo_concepto tipo_concepto NOT NULL,
  categoria categoria_concepto NOT NULL,
  naturaleza naturaleza_concepto NOT NULL,
  unidad unidad_concepto NOT NULL,
  es_fijo BOOLEAN NOT NULL DEFAULT FALSE,
  es_imponible BOOLEAN NOT NULL DEFAULT FALSE,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_concepto_empresa_codigo UNIQUE (empresa_id, codigo)
);

CREATE INDEX idx_concepto_empresa_id ON concepto(empresa_id);

CREATE TABLE concepto_persona (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contrato_id UUID NOT NULL REFERENCES contrato(id),
  concepto_id UUID NOT NULL REFERENCES concepto(id),
  tipo_valor tipo_valor NOT NULL,
  valor NUMERIC(14,4) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT chk_concepto_persona_valor CHECK (valor >= 0),
  CONSTRAINT chk_concepto_persona_fechas CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio)
);

CREATE INDEX idx_concepto_persona_contrato_id ON concepto_persona(contrato_id);
CREATE INDEX idx_concepto_persona_concepto_id ON concepto_persona(concepto_id);

CREATE TABLE tipo_aporte_ley (
  id SERIAL PRIMARY KEY,
  pais_id INT NOT NULL REFERENCES pais(id),
  codigo VARCHAR(30) NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  concepto_deduccion_id UUID REFERENCES concepto(id),
  concepto_patronal_id UUID REFERENCES concepto(id),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT uq_tipo_aporte_ley_pais_codigo UNIQUE (pais_id, codigo)
);

CREATE INDEX idx_tipo_aporte_ley_pais_id ON tipo_aporte_ley(pais_id);
CREATE INDEX idx_tipo_aporte_ley_deduccion_id ON tipo_aporte_ley(concepto_deduccion_id);
CREATE INDEX idx_tipo_aporte_ley_patronal_id ON tipo_aporte_ley(concepto_patronal_id);

CREATE TABLE parametro_aporte_ley (
  id SERIAL PRIMARY KEY,
  tipo_aporte_id INT NOT NULL REFERENCES tipo_aporte_ley(id),
  empresa_id UUID REFERENCES empresa(id),
  vigente_desde DATE NOT NULL,
  vigente_hasta DATE,
  porcentaje_empleado NUMERIC(8,4) NOT NULL DEFAULT 0,
  porcentaje_patronal NUMERIC(8,4) NOT NULL DEFAULT 0,
  tope_salario_base NUMERIC(14,2),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT chk_parametro_aporte_pct_emp CHECK (porcentaje_empleado >= 0),
  CONSTRAINT chk_parametro_aporte_pct_pat CHECK (porcentaje_patronal >= 0),
  CONSTRAINT chk_parametro_aporte_tope CHECK (tope_salario_base IS NULL OR tope_salario_base >= 0),
  CONSTRAINT chk_parametro_aporte_vigencia CHECK (vigente_hasta IS NULL OR vigente_hasta >= vigente_desde)
);

CREATE INDEX idx_parametro_aporte_ley_tipo_id ON parametro_aporte_ley(tipo_aporte_id);
CREATE INDEX idx_parametro_aporte_ley_empresa_id ON parametro_aporte_ley(empresa_id);

CREATE TABLE afiliacion_ley (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contrato_id UUID NOT NULL REFERENCES contrato(id),
  tipo_aporte_id INT NOT NULL REFERENCES tipo_aporte_ley(id),
  nro_afiliacion VARCHAR(50),
  fecha_afiliacion DATE NOT NULL,
  fecha_baja DATE,
  estado estado_afiliacion NOT NULL DEFAULT 'ACTIVO',
  CONSTRAINT chk_afiliacion_ley_fechas CHECK (fecha_baja IS NULL OR fecha_baja >= fecha_afiliacion)
);

CREATE INDEX idx_afiliacion_ley_contrato_id ON afiliacion_ley(contrato_id);
CREATE INDEX idx_afiliacion_ley_tipo_aporte_id ON afiliacion_ley(tipo_aporte_id);