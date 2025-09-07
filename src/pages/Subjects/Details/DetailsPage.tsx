// src/pages/Subjects/Details/DetailsPage.tsx

import { useNavigate, useParams } from "react-router-dom";
import styles from "./DetailsPage.module.css";
import { useSubjects } from "../../../hooks/useSubjects";

export default function SubjectDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { getSubjectById } = useSubjects();

  if (!id) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>ID inválido</h2>
        <button
          type="button"
          className={styles.btnSecondary}
          onClick={() => navigate("/subjects")}
        >
          Voltar
        </button>
      </div>
    );
  }

  const subject = getSubjectById(Number(id));

  if (!subject) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Disciplina não encontrada</h2>
        <button
          type="button"
          className={styles.btnSecondary}
          onClick={() => navigate("/subjects")}
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Detalhes da Disciplina</h1>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Nome:</span>
        <span className={styles.detailsValue}>{subject.name}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Descrição:</span>
        <span className={styles.detailsValue}>{subject.description || '-'}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Carga Horária:</span>
        <span className={styles.detailsValue}>
          {subject.workloadHours} horas
        </span>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.btnWarning}
          onClick={() => navigate(`/subjects/edit/${subject.id}`)}
        >
          Editar
        </button>
        <button
          type="button"
          className={styles.btnSecondary}
          onClick={() => navigate("/subjects")}
        >
          Voltar à Lista
        </button>
      </div>
    </div>
  );
}
