const MONEDAS_PERMITIDAS = new Set(['VES', 'USD', 'EUR']);
const TIPOS_CUENTA = new Set(['AHORRO', 'CORRIENTE']);

function texto(valor) {
  return String(valor ?? '').trim();
}

function enteroPositivo(valor) {
  const numero = Number(valor);
  return Number.isInteger(numero) && numero > 0 ? numero : null;
}

function uuidValido(valor) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    texto(valor)
  );
}

function validarEmpresaBase(body = {}, { parcial = false } = {}) {
  const errores = [];
  const datos = {};

  const tiene = (snake, camel) =>
    Object.prototype.hasOwnProperty.call(body, snake) ||
    Object.prototype.hasOwnProperty.call(body, camel);

  if (!parcial || tiene('pais_id', 'paisId')) {
    const paisId = enteroPositivo(body.paisId ?? body.pais_id ?? 1);
    if (!paisId) errores.push('El país es obligatorio y debe ser válido.');
    else datos.paisId = paisId;
  }

  if (!parcial || tiene('rif', 'rif')) {
    const rif = texto(body.rif).toUpperCase();
    if (!rif) errores.push('El RIF de la empresa es obligatorio.');
    else if (rif.length > 30) errores.push('El RIF no puede exceder 30 caracteres.');
    else datos.rif = rif;
  }

  if (!parcial || tiene('razon_social', 'razonSocial')) {
    const razonSocial = texto(body.razonSocial ?? body.razon_social);
    if (!razonSocial) errores.push('La razón social es obligatoria.');
    else if (razonSocial.length > 150)
      errores.push('La razón social no puede exceder 150 caracteres.');
    else datos.razonSocial = razonSocial;
  }

  if (!parcial || tiene('nombre_comercial', 'nombreComercial')) {
    const nombreComercial = texto(body.nombreComercial ?? body.nombre_comercial);
    if (nombreComercial.length > 100)
      errores.push('El nombre comercial no puede exceder 100 caracteres.');
    else datos.nombreComercial = nombreComercial || null;
  }

  if (!parcial || tiene('moneda_codigo', 'monedaCodigo')) {
    const monedaCodigo = texto(body.monedaCodigo ?? body.moneda_codigo ?? 'VES').toUpperCase();
    if (!MONEDAS_PERMITIDAS.has(monedaCodigo))
      errores.push('La moneda debe ser VES, USD o EUR.');
    else datos.monedaCodigo = monedaCodigo;
  }

  return { valido: errores.length === 0, errores, datos };
}

export function validarCrearEmpresa(body = {}) {
  return validarEmpresaBase(body, { parcial: false });
}

export function validarActualizarEmpresa(body = {}) {
  const base = validarEmpresaBase(body, { parcial: true });
  if (base.valido && Object.keys(base.datos).length === 0) {
    return {
      valido: false,
      errores: ['Debes enviar al menos un campo para actualizar.'],
      datos: {},
    };
  }
  return base;
}

export function validarCrearCuentaBancaria(body = {}) {
  const errores = [];
  const personaId = texto(body.persona_id ?? body.personaId);
  const bancoId = enteroPositivo(body.banco_id ?? body.bancoId);
  const tipoCuenta = texto(body.tipo_cuenta ?? body.tipoCuenta).toUpperCase();
  const nroCuenta = texto(body.nro_cuenta ?? body.numero_cuenta ?? body.numeroCuenta);
  const titular = texto(body.titular);

  if (!uuidValido(personaId)) errores.push('La persona es obligatoria y debe ser válida.');
  if (!bancoId) errores.push('El banco es obligatorio y debe ser válido.');
  if (!TIPOS_CUENTA.has(tipoCuenta))
    errores.push('El tipo de cuenta debe ser AHORRO o CORRIENTE.');
  if (!nroCuenta) errores.push('El número de cuenta es obligatorio.');
  else if (nroCuenta.length > 30)
    errores.push('El número de cuenta no puede exceder 30 caracteres.');
  if (titular.length > 150) errores.push('El titular no puede exceder 150 caracteres.');

  return {
    valido: errores.length === 0,
    errores,
    datos: {
      personaId,
      bancoId,
      tipoCuenta,
      nroCuenta,
      esPrincipal: Boolean(body.es_principal ?? body.esPrincipal),
      activa: body.activa !== false,
    },
  };
}

export function validarActualizarCuentaBancaria(body = {}) {
  const errores = [];
  const datos = {};
  const tiene = (snake, camel) =>
    Object.prototype.hasOwnProperty.call(body, snake) ||
    Object.prototype.hasOwnProperty.call(body, camel);

  if (tiene('persona_id', 'personaId')) {
    const personaId = texto(body.persona_id ?? body.personaId);
    if (!uuidValido(personaId)) errores.push('La persona debe ser válida.');
    else datos.personaId = personaId;
  }
  if (tiene('banco_id', 'bancoId')) {
    const bancoId = enteroPositivo(body.banco_id ?? body.bancoId);
    if (!bancoId) errores.push('El banco debe ser válido.');
    else datos.bancoId = bancoId;
  }
  if (tiene('tipo_cuenta', 'tipoCuenta')) {
    const tipoCuenta = texto(body.tipo_cuenta ?? body.tipoCuenta).toUpperCase();
    if (!TIPOS_CUENTA.has(tipoCuenta))
      errores.push('El tipo de cuenta debe ser AHORRO o CORRIENTE.');
    else datos.tipoCuenta = tipoCuenta;
  }
  if (tiene('nro_cuenta', 'numeroCuenta') || tiene('numero_cuenta', 'numeroCuenta')) {
    const nroCuenta = texto(body.nro_cuenta ?? body.numero_cuenta ?? body.numeroCuenta);
    if (!nroCuenta) errores.push('El número de cuenta es obligatorio.');
    else if (nroCuenta.length > 30)
      errores.push('El número de cuenta no puede exceder 30 caracteres.');
    else datos.nroCuenta = nroCuenta;
  }
  if (tiene('es_principal', 'esPrincipal')) {
    datos.esPrincipal = Boolean(body.es_principal ?? body.esPrincipal);
  }
  if (tiene('activa', 'activa')) {
    datos.activa = Boolean(body.activa);
  }

  if (errores.length === 0 && Object.keys(datos).length === 0) {
    errores.push('Debes enviar al menos un campo para actualizar.');
  }

  return { valido: errores.length === 0, errores, datos };
}