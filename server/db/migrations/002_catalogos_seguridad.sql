CREATE TABLE pais (
  id SERIAL PRIMARY KEY,
  codigo_iso CHAR(2) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  moneda_codigo CHAR(3),
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE empresa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pais_id INT NOT NULL REFERENCES pais(id),
  rif VARCHAR(30) NOT NULL,
  razon_social VARCHAR(150) NOT NULL,
  nombre_comercial VARCHAR(100),
  direccion VARCHAR(250),
  telefono VARCHAR(20),
  email VARCHAR(120),
  moneda_codigo CHAR(3) NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_empresa_pais_rif UNIQUE (pais_id, rif)
);

CREATE INDEX idx_empresa_pais_id ON empresa(pais_id);

CREATE TABLE persona (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresa(id),
  cedula VARCHAR(20) NOT NULL,
  rif VARCHAR(20),
  primer_nombre VARCHAR(60) NOT NULL,
  segundo_nombre VARCHAR(60),
  primer_apellido VARCHAR(60) NOT NULL,
  segundo_apellido VARCHAR(60),
  fecha_nacimiento DATE,
  sexo sexo,
  estado_civil estado_civil,
  nro_tlf VARCHAR(20),
  email VARCHAR(120),
  direccion VARCHAR(250),
  estado estado_persona NOT NULL DEFAULT 'ACTIVO',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_persona_empresa_cedula UNIQUE (empresa_id, cedula)
);

CREATE INDEX idx_persona_empresa_id ON persona(empresa_id);

CREATE TABLE perfil (
  id SERIAL PRIMARY KEY,
  empresa_id UUID REFERENCES empresa(id),
  nombre_perfil VARCHAR(50) NOT NULL,
  descripcion VARCHAR(200),
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_perfil_empresa_id ON perfil(empresa_id);

CREATE TABLE usuario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresa(id),
  persona_id UUID REFERENCES persona(id),
  username VARCHAR(60) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  debe_cambiar_clave BOOLEAN NOT NULL DEFAULT FALSE,
  intentos_fallidos SMALLINT NOT NULL DEFAULT 0,
  bloqueado_hasta TIMESTAMPTZ,
  ultimo_acceso TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_usuario_empresa_username UNIQUE (empresa_id, username)
);

CREATE INDEX idx_usuario_empresa_id ON usuario(empresa_id);
CREATE INDEX idx_usuario_persona_id ON usuario(persona_id);

CREATE TABLE usuario_perfil (
  usuario_id UUID NOT NULL REFERENCES usuario(id),
  perfil_id INT NOT NULL REFERENCES perfil(id),
  PRIMARY KEY (usuario_id, perfil_id)
);

CREATE INDEX idx_usuario_perfil_perfil_id ON usuario_perfil(perfil_id);

CREATE TABLE refresh_token (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuario(id),
  familia_id UUID NOT NULL,
  token_hash VARCHAR(64) NOT NULL UNIQUE,
  expira_en TIMESTAMPTZ NOT NULL,
  revocado_en TIMESTAMPTZ,
  reemplazado_por UUID REFERENCES refresh_token(id),
  ip VARCHAR(45),
  user_agent VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_refresh_token_usuario_id ON refresh_token(usuario_id);
CREATE INDEX idx_refresh_token_reemplazado_por ON refresh_token(reemplazado_por);

CREATE TABLE subsistema (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL UNIQUE,
  descripcion VARCHAR(200),
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE clase (
  id SERIAL PRIMARY KEY,
  subsistema_id INT NOT NULL REFERENCES subsistema(id),
  nombre VARCHAR(80) NOT NULL,
  descripcion VARCHAR(200),
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_clase_subsistema_id ON clase(subsistema_id);

CREATE TABLE metodo (
  id SERIAL PRIMARY KEY,
  clase_id INT NOT NULL REFERENCES clase(id),
  nombre VARCHAR(80) NOT NULL,
  descripcion VARCHAR(200),
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_metodo_clase_id ON metodo(clase_id);

CREATE TABLE opcion (
  id SERIAL PRIMARY KEY,
  subsistema_id INT NOT NULL REFERENCES subsistema(id),
  nombre VARCHAR(80) NOT NULL,
  descripcion VARCHAR(200),
  orden SMALLINT NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_opcion_subsistema_id ON opcion(subsistema_id);

CREATE TABLE permiso_metodo (
  perfil_id INT NOT NULL REFERENCES perfil(id),
  metodo_id INT NOT NULL REFERENCES metodo(id),
  PRIMARY KEY (perfil_id, metodo_id)
);

CREATE INDEX idx_permiso_metodo_metodo_id ON permiso_metodo(metodo_id);

CREATE TABLE permiso_opcion (
  perfil_id INT NOT NULL REFERENCES perfil(id),
  opcion_id INT NOT NULL REFERENCES opcion(id),
  PRIMARY KEY (perfil_id, opcion_id)
);

CREATE INDEX idx_permiso_opcion_opcion_id ON permiso_opcion(opcion_id);

CREATE TABLE banco (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(10) UNIQUE,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE cuenta_bancaria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  persona_id UUID NOT NULL REFERENCES persona(id),
  banco_id INT NOT NULL REFERENCES banco(id),
  tipo_cuenta tipo_cuenta NOT NULL,
  nro_cuenta VARCHAR(30) NOT NULL,
  es_principal BOOLEAN NOT NULL DEFAULT FALSE,
  activa BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_cuenta_bancaria_persona_id ON cuenta_bancaria(persona_id);
CREATE INDEX idx_cuenta_bancaria_banco_id ON cuenta_bancaria(banco_id);