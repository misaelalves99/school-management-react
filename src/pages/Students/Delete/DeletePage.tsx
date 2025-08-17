// src/pages/Students/Delete/DeletePage.tsx

import { useParams, useNavigate } from "react-router-dom";
import styles from "./DeletePage.module.css";
import { useStudents } from "../../../hooks/useStudents";

export default function StudentDelete() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { students, removeStudent } = useStudents(); // ⚡ usando contexto

  if (!id) return <div>ID inválido</div>;

  const student = students.find(s => s.id === Number(id));
  if (!student) return <div>Aluno não encontrado</div>;

  const handleDelete = () => {
    removeStudent(student.id); // ⚡ usando contexto
    alert("Aluno excluído com sucesso!");
    navigate("/students");
  };

  return (
    <div className={styles.container}>
      <h1>Excluir Aluno</h1>
      <p className={styles.warning}>
        Tem certeza que deseja excluir <strong>{student.name}</strong>?
      </p>
      <button onClick={handleDelete} className={styles.btnDelete}>Confirmar Exclusão</button>
      <button onClick={() => navigate("/students")} className={styles.btnCancel}>Cancelar</button>
    </div>
  );
}
