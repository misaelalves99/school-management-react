// src/pages/Teachers/Delete/DeletePage.tsx

import { useParams, useNavigate } from "react-router-dom";
import styles from "./DeletePage.module.css";
import { useTeachers } from "../../../hooks/useTeachers";

export default function TeacherDelete() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTeacher, removeTeacher } = useTeachers();

  if (!id) return <div>Id inválido</div>;

  const teacher = getTeacher(Number(id));

  if (!teacher) {
    return <div>Professor não encontrado.</div>;
  }

  const handleDelete = () => {
    removeTeacher(teacher.id);
    alert("Professor excluído com sucesso.");
    navigate("/teachers");
  };

  const handleCancel = () => {
    navigate("/teachers");
  };

  return (
    <>
      <h1 className={styles.title}>Excluir Professor</h1>
      <h3 className={styles.warning}>Tem certeza que deseja excluir este professor?</h3>

      <div className={styles.infoBox}>
        <h4>{teacher.name}</h4>
        <p>E-mail: {teacher.email}</p>
        <p>Telefone: {teacher.phone}</p>
      </div>

      <form
        onSubmit={e => {
          e.preventDefault();
          handleDelete();
        }}
        className={styles.form}
      >
        <button type="submit" className={`${styles.btn} ${styles.btnDanger}`}>
          Excluir
        </button>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={handleCancel}
        >
          Cancelar
        </button>
      </form>
    </>
  );
}
