// src/pages/Enrollments/Details/DetailsPage.tsx

import { useNavigate } from 'react-router-dom';
import styles from './DetailsPage.module.css';
import type { EnrollmentDetails as EnrollmentDetailsType } from '../../../types/enrollmentDetails';

interface DetailsProps {
  enrollment: EnrollmentDetailsType;
}

export default function EnrollmentDetails({ enrollment }: DetailsProps) {
  const navigate = useNavigate();

  return (
    <>
      <h1 className={styles.title}>Detalhes da Matrícula</h1>

      <div className={styles.detailsContainer}>
        <dl className={styles.dlRow}>
          <dt className={styles.dt}>Aluno</dt>
          <dd className={styles.dd}>{enrollment.studentName ?? 'Aluno não informado'}</dd>

          <dt className={styles.dt}>Turma</dt>
          <dd className={styles.dd}>{enrollment.classRoomName ?? 'Turma não informada'}</dd>

          <dt className={styles.dt}>Status</dt>
          <dd className={styles.dd}>{enrollment.status ?? '-'}</dd>

          <dt className={styles.dt}>Data da Matrícula</dt>
          <dd>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</dd>
        </dl>
      </div>

      <div>
        <button
          className={`${styles.btn} ${styles.btnWarning}`}
          onClick={() => navigate(`/enrollments/edit/${enrollment.id}`)}
        >
          Editar
        </button>
        <button
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={() => navigate('/enrollments')}
        >
          Voltar
        </button>
      </div>
    </>
  );
}
