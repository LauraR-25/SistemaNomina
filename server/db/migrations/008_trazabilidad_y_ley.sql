ALTER TABLE tipo_aporte_ley
  ADD COLUMN entidad VARCHAR(100);

ALTER TABLE parametro_aporte_ley
  ADD COLUMN piso_base NUMERIC(14,2),
  ADD COLUMN base_legal VARCHAR(200),
  ADD CONSTRAINT chk_parametro_aporte_ley_piso_base
    CHECK (piso_base IS NULL OR piso_base >= 0);

ALTER TABLE periodo_nomina
  ADD COLUMN descripcion VARCHAR(200),
  ADD COLUMN procesado_por UUID REFERENCES usuario(id),
  ADD COLUMN fecha_proceso TIMESTAMPTZ;

ALTER TABLE recibo_pago
  ADD COLUMN cuenta_bancaria_id UUID REFERENCES cuenta_bancaria(id),
  ADD COLUMN pagado_por UUID REFERENCES usuario(id),
  ADD COLUMN fecha_emision DATE;

ALTER TABLE detalle_prenomina
  ADD COLUMN novedad_id UUID REFERENCES novedad(id),
  ADD COLUMN concepto_persona_id UUID REFERENCES concepto_persona(id),
  ADD COLUMN parametro_aporte_id INT REFERENCES parametro_aporte_ley(id),
  ADD COLUMN base_calculo NUMERIC(14,2),
  ADD COLUMN tasa_aplicada NUMERIC(8,4);

ALTER TABLE detalle_recibo
  ADD COLUMN novedad_id UUID REFERENCES novedad(id),
  ADD COLUMN concepto_persona_id UUID REFERENCES concepto_persona(id),
  ADD COLUMN parametro_aporte_id INT REFERENCES parametro_aporte_ley(id),
  ADD COLUMN base_calculo NUMERIC(14,2),
  ADD COLUMN tasa_aplicada NUMERIC(8,4);

CREATE INDEX idx_periodo_nomina_procesado_por ON periodo_nomina(procesado_por);
CREATE INDEX idx_recibo_pago_cuenta_bancaria_id ON recibo_pago(cuenta_bancaria_id);
CREATE INDEX idx_recibo_pago_pagado_por ON recibo_pago(pagado_por);
CREATE INDEX idx_detalle_prenomina_novedad_id ON detalle_prenomina(novedad_id);
CREATE INDEX idx_detalle_prenomina_concepto_persona_id ON detalle_prenomina(concepto_persona_id);
CREATE INDEX idx_detalle_prenomina_parametro_aporte_id ON detalle_prenomina(parametro_aporte_id);
CREATE INDEX idx_detalle_recibo_novedad_id ON detalle_recibo(novedad_id);
CREATE INDEX idx_detalle_recibo_concepto_persona_id ON detalle_recibo(concepto_persona_id);
CREATE INDEX idx_detalle_recibo_parametro_aporte_id ON detalle_recibo(parametro_aporte_id);
