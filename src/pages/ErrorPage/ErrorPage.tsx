// src/pages/ErrorPage/ErrorPage.tsx

import { useLocation } from 'react-router-dom';
import styles from './ErrorPage.module.css';
import type { ErrorData } from '../../types/errorData';

export default function ErrorPage() {
  const location = useLocation();
  const state = location.state as { error?: ErrorData } | undefined;

  return (
    <div className={styles.errorContainer}>
      <h1 className={styles.errorTitle}>Ops! Algo deu errado.</h1>

      <p className={styles.errorDescription}>
        Desculpe, ocorreu um erro inesperado enquanto processávamos sua requisição.
      </p>

      {state?.error && (
        <div className={styles.errorDetails}>
          <h3>Detalhes do Erro:</h3>
          <p>
            <strong>Mensagem:</strong> {state.error.message}
          </p>
          <pre>{state.error.stack}</pre>
        </div>
      )}

      <a href="/" className={styles.btnReturn}>⬅ Voltar para o Início</a>
    </div>
  );
}
