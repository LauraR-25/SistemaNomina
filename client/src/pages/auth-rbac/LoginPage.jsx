import { useEffect, useRef, useState } from 'react';
import { LoginForm } from '../../components/auth-rbac/LoginForm/index.js';
import { Loader } from '../../components/common/feedback/Loader/index.js';
import { AuthLayout } from '../../layouts/AuthLayout.jsx';
import { useAuth } from '../../hooks/auth-rbac/useAuth.js';
import { resolverNotificacionLogin } from './loginPage.model.js';
import styles from './LoginPage.module.css';

export function LoginPage({ onContinuar }) {
  const { iniciarSesion, loading, notificacion } = useAuth();
  const temporizador = useRef(null);
  const [estadoLogin, setEstadoLogin] = useState(null);

  useEffect(
    () => () => {
      if (temporizador.current) {
        clearTimeout(temporizador.current);
      }
    },
    []
  );

  async function manejarEnvio(credenciales) {
    if (temporizador.current) {
      clearTimeout(temporizador.current);
      temporizador.current = null;
    }

    const resultado = await iniciarSesion(credenciales);
    setEstadoLogin({ status: resultado?.status });

    if (resultado?.ok && typeof onContinuar === 'function') {
      temporizador.current = setTimeout(onContinuar, 1100);
    }
  }

  const notificacionVisible = resolverNotificacionLogin(
    notificacion,
    estadoLogin?.status
  );

  return (
    <AuthLayout>
      <div className={styles.pagina}>
        <LoginForm
          onSubmit={manejarEnvio}
          loading={loading}
          notificacion={notificacionVisible}
        />

        <p className={styles.contacto}>
          ¿Problemas para acceder? Contacta al administrador
        </p>
      </div>

      {loading && (
        <Loader variant="pantalla" size="lg" mensaje="Autenticando..." />
      )}
    </AuthLayout>
  );
}

export default LoginPage;
