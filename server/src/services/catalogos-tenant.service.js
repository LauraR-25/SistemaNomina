import { pool } from '../config/db.js';

export async function listarPaises() {
  const res = await pool.query(
    `SELECT id, codigo_iso, nombre, moneda_codigo, activo
     FROM pais
     WHERE activo = TRUE
     ORDER BY nombre ASC`
  );
  return res.rows;
}

export async function listarBancos() {
  const res = await pool.query(
    `SELECT id, codigo, nombre, activo
     FROM banco
     WHERE activo = TRUE
     ORDER BY nombre ASC`
  );
  return res.rows;
}

export async function listarEmpresas() {
  const res = await pool.query(
    `SELECT id, pais_id, rif, razon_social, nombre_comercial, moneda_codigo, activo
     FROM empresa
     WHERE activo = TRUE
     ORDER BY created_at DESC`
  );
  return res.rows;
}

export async function crearEmpresa(datos) {
  const res = await pool.query(
    `INSERT INTO empresa (pais_id, rif, razon_social, nombre_comercial, moneda_codigo, activo)
     VALUES ($1, $2, $3, $4, $5, TRUE)
     RETURNING id, pais_id, rif, razon_social, nombre_comercial, moneda_codigo, activo`,
    [datos.paisId, datos.rif, datos.razonSocial, datos.nombreComercial, datos.monedaCodigo]
  );
  return res.rows[0];
}