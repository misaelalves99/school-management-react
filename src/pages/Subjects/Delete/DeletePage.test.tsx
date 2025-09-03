// src/pages/Subjects/Delete/DeletePage.tsx

import { useNavigate, useParams } from "react-router-dom";
import styles from "./DeletePage.module.css";
import { useSubjects } from "../../../hooks/useSubjects";

export default function SubjectDeletePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getSubjectById, deleteSubject, reloadSubjects } = useSubjects();

  if (!id) {
    return (
      <div className={styles.container}>
        <h2>ID inválido.</h2>
        <button className={styles.btnSecondary} onClick={() => navigate("/subjects")}>
          Voltar
        </button>
      </div>
    );
  }

  const subjectId = Number(id);
  const subject = getSubjectById(subjectId);

  if (!subject) {
    return (
      <div className={styles.container}>
        <h2>Disciplina não encontrada.</h2>
        <button className={styles.btnSecondary} onClick={() => navigate("/subjects")}>
          Voltar
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    const deleted = deleteSubject(subject.id);
    if (!deleted) {
      alert("Erro ao excluir a disciplina.");
      return;
    }

    reloadSubjects();
    alert("Disciplina excluída com sucesso!");
    navigate("/subjects");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Excluir Disciplina</h1>
      <h3 className={styles.warning}>
        Tem certeza que deseja excluir <strong>{subject.name}</strong>?
      </h3>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Descrição:</span>
        <span className={styles.detailsValue}>{subject.description || '-'}</span>
      </div>
      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Carga Horária:</span>
        <span className={styles.detailsValue}>{subject.workloadHours} horas</span>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.btnDanger} onClick={handleDelete}>
          Excluir
        </button>
        <button type="button" className={styles.btnSecondary} onClick={() => navigate("/subjects")}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
