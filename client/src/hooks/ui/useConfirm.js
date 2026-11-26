import { createElement, useCallback, useEffect, useState } from 'react';
import { ConfirmDialog } from '../../components/common/overlays/ConfirmDialog/index.js';

const PREDETERMINADOS = {
  titulo: '¿Confirmar acción?',
  mensaje: '',
  textoConfirmar: 'Confirmar',
  textoCancelar: 'Cancelar',
  variante: 'primario',
  loading: false,
};

function normalizarOpciones(opciones, predeterminadas) {
  const config = typeof opciones === 'string' ? { mensaje: opciones } : opciones ?? {};

  return {
    titulo: config.titulo ?? predeterminadas.titulo ?? PREDETERMINADOS.titulo,
    mensaje: config.mensaje ?? predeterminadas.mensaje ?? PREDETERMINADOS.mensaje,
    textoConfirmar:
      config.textoConfirmar ??
      predeterminadas.textoConfirmar ??
      PREDETERMINADOS.textoConfirmar,
    textoCancelar:
      config.textoCancelar ??
      predeterminadas.textoCancelar ??
      PREDETERMINADOS.textoCancelar,
    variante: config.variante ?? predeterminadas.variante ?? PREDETERMINADOS.variante,
    loading: config.loading ?? predeterminadas.loading ?? PREDETERMINADOS.loading,
  };
}

export function useConfirm(configPredeterminada = {}) {
  const [estado, setEstado] = useState(null);
  const [pendiente, setPendiente] = useState(null);

  const resolver = useCallback(
    (resultado) => {
      setEstado(null);
      setPendiente(null);
      pendiente?.resolve?.(resultado);
    },
    [pendiente]
  );

  const confirmar = useCallback(
    (opciones = {}) => {
      pendiente?.resolve?.(false);

      return new Promise((resolve) => {
        setPendiente({ resolve });
        setEstado(normalizarOpciones(opciones, configPredeterminada));
      });
    },
    [configPredeterminada, pendiente]
  );

  useEffect(
    () => () => {
      pendiente?.resolve?.(false);
    },
    [pendiente]
  );

  const cerrar = useCallback(() => resolver(false), [resolver]);

  const dialogo = estado
    ? createElement(ConfirmDialog, {
        ...estado,
        abierto: true,
        onConfirmar: () => resolver(true),
        onCancelar: () => resolver(false),
      })
    : null;

  return {
    confirmar,
    dialogo,
    confirmDialog: dialogo,
    cerrar,
    estaAbierto: Boolean(estado),
  };
}

export default useConfirm;
