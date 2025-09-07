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
        <button
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={() => navigate("/teachers")}
        >
          Voltar à Lista
        </button>
      </div>
    );
  }

  const teacherId = Number(id);
  const teacher = getTeacher(teacherId);

  if (!teacher) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Professor não encontrado</h1>
        <button
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={() => navigate("/teachers")}
        >
          Voltar à Lista
        </button>
      </div>
    );
  }

  const formattedDate = new Date(teacher.dateOfBirth).toLocaleDateString("pt-BR");

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Detalhes do Professor</h1>

      {[
        { label: "Nome", value: teacher.name },
        { label: "Email", value: teacher.email },
        { label: "Data de Nascimento", value: formattedDate },
        { label: "Disciplina", value: teacher.subject },
        { label: "Telefone", value: teacher.phone || "-" },
        { label: "Endereço", value: teacher.address || "-" },
      ].map(({ label, value }) => (
        <div key={label} className={styles.detailsRow}>
          <span className={styles.detailsLabel}>{label}:</span>
          <span className={styles.detailsValue}>{value}</span>
        </div>
      ))}

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
