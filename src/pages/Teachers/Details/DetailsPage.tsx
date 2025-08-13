// src/pages/Teachers/Details/DetailsPage.tsx

import { useParams, useNavigate } from "react-router-dom";
import styles from "./DetailsPage.module.css";
import { getTeacherById } from "../../../mocks/teachers";

export default function TeacherDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) return <div>Id inválido</div>;

  const teacher = getTeacherById(Number(id));

  if (!teacher) {
    return <div>Professor não encontrado.</div>;
  }

  const formattedDate = new Date(teacher.dateOfBirth).toLocaleDateString();

  return (
    <>
      <h1 className={styles.title}>Detalhes do Professor</h1>
      <div className={styles.container}>
        {teacher.photoUrl && (
          <img
            src={teacher.photoUrl}
            alt={`${teacher.name} foto`}
            className={styles["profile-photo"]}
          />
        )}
        <div><strong>Nome:</strong> {teacher.name}</div>
        <div><strong>Email:</strong> {teacher.email}</div>
        <div><strong>Data de Nascimento:</strong> {formattedDate}</div>
        <div><strong>Disciplina:</strong> {teacher.subject}</div>
        <div><strong>Telefone:</strong> {teacher.phone}</div>
        <div><strong>Endereço:</strong> {teacher.address}</div>

        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles["btn-warning"]}`}
            onClick={() => navigate(`/teachers/edit/${teacher.id}`)}
          >
            Editar
          </button>
          <button
            className={`${styles.btn} ${styles["btn-secondary"]}`}
            onClick={() => navigate("/teachers")}
          >
            Voltar à Lista
          </button>
        </div>
      </div>
    </>
  );
}
