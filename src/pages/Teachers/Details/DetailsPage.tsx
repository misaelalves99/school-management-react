// src/pages/Teachers/Details/DetailsPage.tsx

import { useParams, useNavigate } from "react-router-dom";
import styles from "./DetailsPage.module.css";
import { useTeachers } from "../../../hooks/useTeachers";

export default function TeacherDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTeacher } = useTeachers();

  if (!id) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>ID do professor não fornecido</h1>
        <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => navigate("/teachers")}>
          Voltar à Lista
        </button>
      </div>
    );
  }

  const teacher = getTeacher(Number(id));
  if (!teacher) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Professor não encontrado</h1>
        <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => navigate("/teachers")}>
          Voltar à Lista
        </button>
      </div>
    );
  }

  const formattedDate = new Date(teacher.dateOfBirth).toLocaleDateString("pt-BR");

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Detalhes do Professor</h1>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Nome:</span>
        <span className={styles.detailsValue}>{teacher.name}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Email:</span>
        <span className={styles.detailsValue}>{teacher.email}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Data de Nascimento:</span>
        <span className={styles.detailsValue}>{formattedDate}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Disciplina:</span>
        <span className={styles.detailsValue}>{teacher.subject}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Telefone:</span>
        <span className={styles.detailsValue}>{teacher.phone || "-"}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Endereço:</span>
        <span className={styles.detailsValue}>{teacher.address || "-"}</span>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.btn} ${styles.btnWarning}`}
          onClick={() => navigate(`/teachers/edit/${teacher.id}`)}
        >
          Editar
        </button>
        <button
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={() => navigate("/teachers")}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
