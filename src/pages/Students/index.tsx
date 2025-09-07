// src/pages/Students/index.tsx

import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useStudents } from "../../hooks/useStudents";
import styles from "./StudentsPage.module.css";

export default function StudentIndex() {
  const { students, refreshStudents } = useStudents();
  const [search, setSearch] = useState("");

  useEffect(() => {
    refreshStudents();
  }, [refreshStudents]);

  const filteredStudents = useMemo(() => {
    const term = search.toLowerCase();
    return students.filter((s) => s.name.toLowerCase().includes(term));
  }, [students, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className={styles.pageContainer}>
      <aside className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Alunos</h2>
        <form onSubmit={(e) => e.preventDefault()} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Digite o nome do aluno..."
            value={search}
            onChange={handleSearchChange}
            className={styles.input}
            aria-label="Buscar aluno"
          />
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            Buscar
          </button>
        </form>
        <Link to="/students/create" className={`${styles.btn} ${styles.btnSuccess}`}>
          Cadastrar Novo Aluno
        </Link>
      </aside>

      <main className={styles.rightPanel}>
        <h2 className={styles.title}>Lista de Alunos</h2>

        {filteredStudents.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Matrícula</th>
                  <th>Telefone</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.enrollmentNumber || '-'}</td>
                    <td>{student.phone || '-'}</td>
                    <td className={styles.actionsCell}>
                      <Link
                        to={`/students/details/${student.id}`}
                        className={`${styles.btn} ${styles.btnInfo}`}
                      >
                        Detalhes
                      </Link>
                      <Link
                        to={`/students/edit/${student.id}`}
                        className={`${styles.btn} ${styles.btnWarning}`}
                      >
                        Editar
                      </Link>
                      <Link
                        to={`/students/delete/${student.id}`}
                        className={`${styles.btn} ${styles.btnDanger}`}
                      >
                        Excluir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className={styles.noResults}>Nenhum aluno encontrado.</p>
        )}
      </main>
    </div>
  );
}
