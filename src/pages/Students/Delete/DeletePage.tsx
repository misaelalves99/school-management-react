// src/pages/Students/Delete/DeletePage.tsx

import { useParams, useNavigate } from "react-router-dom";
import styles from "./DeletePage.module.css";
import { useStudents } from "../../../hooks/useStudents";

export default function StudentDelete() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { students, removeStudent } = useStudents();

  const studentId = Number(id);

  if (!id || isNaN(studentId)) return <div>ID inválido</div>;

  const student = students.find(s => s.id === studentId);
  if (!student) return <div>Aluno não encontrado</div>;

  const handleDelete = async () => {
    try {
      await removeStudent(student.id);
      alert("Aluno excluído com sucesso!");
      navigate("/students");
    } catch (err) {
      console.error("Erro ao excluir aluno:", err);
      alert("Ocorreu um erro ao excluir o aluno.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Excluir Aluno</h1>
      <h3 className={styles.warning}>
        Tem certeza que deseja excluir <strong>{student.name}</strong>?
      </h3>

      <div className={styles.actions}>
        <button onClick={handleDelete} className={styles.btnDelete}>
          Excluir
        </button>
        <button onClick={() => navigate("/students")} className={styles.btnCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
