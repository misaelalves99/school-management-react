// src/pages/Enrollments/Delete/DeletePage.tsx

import { useNavigate } from 'react-router-dom';
import styles from './DeletePage.module.css';
import type { EnrollmentWithNames } from '../../../types/EnrollmentWithNames';

interface DeleteEnrollmentProps {
  enrollment: EnrollmentWithNames;
  onDelete: (id: number) => Promise<void>;
}

export default function DeleteEnrollment({ enrollment, onDelete }: DeleteEnrollmentProps) {
  const navigate = useNavigate();

  async function handleDelete(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await onDelete(enrollment.id);
      navigate('/enrollments');
    } catch (error) {
      console.error('Erro ao excluir matrícula:', error);
      alert('Ocorreu um erro ao excluir a matrícula. Tente novamente.');
    }
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Excluir Matrícula</h1>
      <h3 className={styles.warning}>
        Tem certeza que deseja excluir esta matrícula?
      </h3>

      <div className={styles.detailsContainer}>
        <p><strong>Aluno:</strong> {enrollment.studentName}</p>
        <p><strong>Turma:</strong> {enrollment.classRoomName}</p>
        <p><strong>Data da Matrícula:</strong> {new Date(enrollment.enrollmentDate).toLocaleDateString()}</p>
        <p><strong>Status:</strong> {enrollment.status}</p>
      </div>

      <form onSubmit={handleDelete} className={styles.form}>
        <button type="submit" className={styles.btnDanger}>Excluir</button>
        <button type="button" className={styles.btnSecondary} onClick={() => navigate('/enrollments')}>
          Cancelar
        </button>
      </form>
    </div>
  );
}
