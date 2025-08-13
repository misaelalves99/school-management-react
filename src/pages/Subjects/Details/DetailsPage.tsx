// src/pages/Subjects/Details/DetailsPage.tsx

import { useNavigate, useParams } from 'react-router-dom';
import styles from './DetailsPage.module.css';

interface Subject {
  id: number;
  name: string;
  workloadHours: number;
}

// Mock de várias disciplinas
const mockSubjects: Subject[] = [
  { id: 1, name: 'Matemática', workloadHours: 60 },
  { id: 2, name: 'Física', workloadHours: 60 },
  { id: 3, name: 'Química', workloadHours: 60 },
];

export default function SubjectDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Buscar o subject pelo id recebido nos params
  const subjectId = Number(id);
  const subject = mockSubjects.find(s => s.id === subjectId);

  if (!subject) {
    return (
      <div className={styles.container}>
        <h2>Disciplina não encontrada.</h2>
        <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => navigate('/subjects')}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <>
      <h1 className={styles.title}>Detalhes da Disciplina</h1>

      <div className={styles.container}>
        <dl className={styles.row}>
          <dt>Nome</dt>
          <dd>{subject.name}</dd>

          <dt>Carga Horária</dt>
          <dd>{subject.workloadHours} horas</dd>
        </dl>
      </div>

      <button
        className={`${styles.btn} ${styles.btnWarning}`}
        onClick={() => navigate(`/subjects/edit/${subject.id}`)}
      >
        Editar
      </button>

      <button
        className={`${styles.btn} ${styles.btnSecondary}`}
        onClick={() => navigate('/subjects')}
      >
        Voltar
      </button>
    </>
  );
}
