import { Component, Fragment } from 'react';
import { ErrorState } from '../../data/ErrorState/index.js';
import styles from './ErrorBoundary.module.css';

export class ErrorBoundary extends Component {
  state = { error: null, intento: 0 };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Error al renderizar la pantalla', error, info);
  }

  reintentar = () => {
    this.setState((actual) => ({ error: null, intento: actual.intento + 1 }));
  };

  render() {
    const { error, intento } = this.state;

    if (error) {
      const mensaje = error?.message ?? String(error);
      const stack = import.meta.env.DEV ? error?.stack : null;

      return (
        <div className={styles.contenedor}>
          <ErrorState
            titulo="No se pudo mostrar esta pantalla"
            mensaje={mensaje}
            onRetry={this.reintentar}
          >
            {stack && <pre className={styles.stack}>{stack}</pre>}
          </ErrorState>
        </div>
      );
    }

    return <Fragment key={intento}>{this.props.children}</Fragment>;
  }
}

export default ErrorBoundary;
