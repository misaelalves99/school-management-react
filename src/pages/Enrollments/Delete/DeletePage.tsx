// src/pages/Enrollments/Delete/DeletePage.tsx

import { useNavigate } from 'react-router-dom';
import styles from './DeletePage.module.css';
import { EnrollmentDetails } from '../../../types/enrollmentDetails';

interface DeleteEnrollmentProps {
  enrollment: EnrollmentDetails;
  onDelete: (id: number) => Promise<void>;
}

export default function DeleteEnrollment({ enrollment, onDelete }: DeleteEnrollmentProps) {
  const navigate = useNavigate();

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    try {
      await onDelete(enrollment.id);
      navigate('/enrollments');
    } catch (error) {
      console.error('Erro ao excluir matrícula:', error);
    }
  }

  return (
    <>
      <h1 className={styles.title}>Excluir Matrícula</h1>

      <h3 className={styles.warning}>Tem certeza que deseja excluir esta matrícula?</h3>

      <div className={styles.detailsContainer}>
        <h4>Aluno: {enrollment.studentName ?? 'Aluno não informado'}</h4>
        <p>Turma: {enrollment.classRoomName ?? 'Turma não informada'}</p>
        <p>Data da Matrícula: {new Date(enrollment.enrollmentDate).toLocaleDateString()}</p>
      </div>

      <form onSubmit={handleDelete} className={styles.form}>
        <button type="submit" className={styles.btnDanger}>Excluir</button>
        <button
          type="button"
          className={styles.btnSecondary}
          onClick={() => navigate('/enrollments')}
        >
          Cancelar
        </button>
      </form>
    </>
  );
}
