export function errorMiddleware(err, req, res, next) {
  console.error('Error no controlado:', err);

  if (err?.code === '23505') {
    return res.status(409).json({
      ok: false,
      message: err.mensajePublico || 'Ya existe un registro con esos datos.',
    });
  }

  if (err?.code === '23503') {
    return res.status(400).json({
      ok: false,
      message:
        err.mensajePublico || 'La referencia indicada no existe o no es válida.',
    });
  }

  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor.';

  res.status(status).json({
    ok: false,
    message,
  });
}