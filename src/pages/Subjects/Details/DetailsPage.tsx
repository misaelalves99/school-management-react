// src/pages/Subjects/Details/DetailsPage.tsx

import { useNavigate, useParams } from 'react-router-dom';
import styles from './DetailsPage.module.css';
import { mockSubjects } from '../../../mocks/subjects';
import type { Subject } from '../../../types/Subject';

export default function SubjectDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Converter o ID de string para número
  const subjectId = Number(id);

  // Buscar o subject usando o método list()
  const subject: Subject | undefined = mockSubjects.list().find(
    (s: Subject) => s.id === subjectId
  );

  if (!subject) {
    return (
      <div className={styles.container}>
        <h2>Disciplina não encontrada.</h2>
        <button
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={() => navigate('/subjects')}
        >
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

          <dt>Descrição</dt>
          <dd>{subject.description}</dd>

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
