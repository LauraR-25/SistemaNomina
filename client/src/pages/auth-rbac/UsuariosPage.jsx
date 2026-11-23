export function crearModeloUsuariosPage(usuariosIniciales = []) {
  return {
    titulo: 'Gestión de Usuarios',
    usuarios: usuariosIniciales,
    filtro: '',
  };
}

export function filtrarUsuariosModelo(modeloActual, textoFiltro = '') {
  const termino = textoFiltro.trim().toLowerCase();
  const filtrados = !termino
    ? modeloActual.usuarios
    : modeloActual.usuarios.filter((u) =>
        String(u.username || '').toLowerCase().includes(termino)
      );

  return {
    ...modeloActual,
    filtro: textoFiltro,
    usuariosFiltrados: filtrados,
  };
}

export default {
  crearModeloUsuariosPage,
  filtrarUsuariosModelo,
};