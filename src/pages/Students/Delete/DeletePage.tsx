// src/pages/Students/Delete/DeletePage.tsx

import { useParams, useNavigate } from 'react-router-dom';
import styles from './DeletePage.module.css';

export default function DeleteStudent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to delete student
    alert(`Aluno ${id} excluído!`);
    navigate('/students');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Excluir Aluno</h1>
      <p className={styles.warning}>
        Tem certeza que deseja excluir o aluno <strong>ID: {id}</strong>?
      </p>
      <form onSubmit={handleDelete} className={styles.form}>
        <button type="submit" className={styles.btnDelete}>Confirmar Exclusão</button>
        <button type="button" className={styles.btnCancel} onClick={() => navigate('/students')}>Cancelar</button>
      </form>
    </div>
  );
}
