// src/pages/Subjects/Delete/DeletePage.tsx

import { useNavigate, useParams } from 'react-router-dom';
import styles from './DeletePage.module.css';

export default function DeleteSubject() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleDelete = () => {
    console.log('Excluir disciplina com ID:', id); // Aqui faria a chamada à API
    navigate('/subjects');
  };

  return (
    <>
      <h1 className={styles.title}>Excluir Disciplina</h1>
      <h3 className={styles.warning}>Tem certeza que deseja excluir esta disciplina?</h3>

      <div className={styles.subjectBox}>
        <h4>Nome da Disciplina (simulado)</h4>
        <p>Carga Horária: 60 horas</p>
      </div>

      <form className={styles.form}>
        <button type="button" className={styles.btnDanger} onClick={handleDelete}>Excluir</button>
        <button type="button" className={styles.btnSecondary} onClick={() => navigate('/subjects')}>Cancelar</button>
      </form>
    </>
  );
}
