// src/pages/Students/Details/DetailsPage.tsx

import { useParams, useNavigate } from "react-router-dom";
import styles from "./DetailsPage.module.css";
import { useStudents } from "../../../hooks/useStudents";

export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students } = useStudents();

  if (!id) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>ID do aluno não fornecido</h1>
        <button
          className={styles.btnSecondary}
          onClick={() => navigate("/students")}
        >
          Voltar à Lista
        </button>
      </div>
    );
  }

  const student = students.find(s => s.id === Number(id));
  if (!student) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Aluno não encontrado</h1>
        <button
          className={styles.btnSecondary}
          onClick={() => navigate("/students")}
        >
          Voltar à Lista
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Detalhes do Aluno</h1>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Nome:</span>
        <span className={styles.detailsValue}>{student.name}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Email:</span>
        <span className={styles.detailsValue}>{student.email}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Data de Nascimento:</span>
        <span className={styles.detailsValue}>{student.dateOfBirth}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Número de Matrícula:</span>
        <span className={styles.detailsValue}>{student.enrollmentNumber}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Telefone:</span>
        <span className={styles.detailsValue}>{student.phone || '-'}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Endereço:</span>
        <span className={styles.detailsValue}>{student.address || '-'}</span>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.btnWarning}
          onClick={() => navigate(`/students/edit/${student.id}`)}
        >
          Editar
        </button>
        <button
          className={styles.btnSecondary}
          onClick={() => navigate("/students")}
        >
          Voltar à Lista
        </button>
      </div>
    </div>
  );
}
