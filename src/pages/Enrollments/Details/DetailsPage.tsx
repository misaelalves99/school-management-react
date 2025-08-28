// src/pages/Enrollments/Details/DetailsPage.tsx

// src/pages/Enrollments/Details/DetailsPage.tsx

import { useNavigate } from 'react-router-dom';
import styles from './DetailsPage.module.css';
import type { EnrollmentWithNames } from '../../../types/EnrollmentWithNames';

interface DetailsProps {
  enrollment: EnrollmentWithNames;
}

export default function EnrollmentDetails({ enrollment }: DetailsProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Detalhes da Matrícula</h1>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Aluno:</span>
        <span className={styles.detailsValue}>{enrollment.studentName}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Turma:</span>
        <span className={styles.detailsValue}>{enrollment.classRoomName}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Status:</span>
        <span className={styles.detailsValue}>{enrollment.status}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Data da Matrícula:</span>
        <span className={styles.detailsValue}>
          {new Date(enrollment.enrollmentDate).toLocaleDateString()}
        </span>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.btnWarning}
          onClick={() => navigate(`/enrollments/edit/${enrollment.id}`)}
        >
          Editar
        </button>
        <button
          className={styles.btnSecondary}
          onClick={() => navigate('/enrollments')}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
