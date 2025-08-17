// src/pages/Students/Details/DetailsPage.tsx

import { useParams, useNavigate } from "react-router-dom";
import styles from "./DetailsPage.module.css";
import { useStudents } from "../../../hooks/useStudents";

export default function StudentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { students } = useStudents(); // ⚡ usando contexto

  if (!id) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>ID do aluno não fornecido</h1>
        <button className={styles.btnSecondary} onClick={() => navigate("/students")}>
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
        <button className={styles.btnSecondary} onClick={() => navigate("/students")}>
          Voltar à Lista
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Detalhes do Aluno</h1>
      <div><strong>Nome:</strong> {student.name}</div>
      <div><strong>Email:</strong> {student.email}</div>
      <div><strong>Data de Nascimento:</strong> {student.dateOfBirth}</div>
      <div><strong>Número de Matrícula:</strong> {student.enrollmentNumber}</div>
      <div><strong>Telefone:</strong> {student.phone || "-"}</div>
      <div><strong>Endereço:</strong> {student.address || "-"}</div>

      <div className={styles.actions}>
        <button
          className={styles.btnWarning}
          onClick={() => navigate(`/students/edit/${student.id}`)}
        >
          Editar
        </button>
        <button className={styles.btnSecondary} onClick={() => navigate("/students")}>
          Voltar à Lista
        </button>
      </div>
    </div>
  );
}
