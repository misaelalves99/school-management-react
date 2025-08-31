// src/pages/Students/index.tsx

import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useStudents } from "../../hooks/useStudents";
import styles from "./StudentsPage.module.css";

export default function StudentIndex() {
  const { students, refreshStudents } = useStudents();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredStudents = useMemo(() => {
    const term = search.toLowerCase();
    return students.filter((s) => s.name.toLowerCase().includes(term));
  }, [students, search]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const pagedStudents = filteredStudents.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    refreshStudents();
  }, [refreshStudents]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className={styles.pageContainer}>
      <aside className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Alunos</h2>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Digite o nome do aluno..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.input}
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

        {pagedStudents.length > 0 ? (
          <>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Matrícula</th> {/* Adicionado */}
                    <th>Telefone</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.name}</td>
                      <td>{student.enrollmentNumber || '-'}</td> {/* Adicionado */}
                      <td>{student.phone || '-'}</td>
                      <td className={styles.actionsCell}>
                        <Link to={`/students/details/${student.id}`} className={`${styles.btn} ${styles.btnInfo}`}>
                          Detalhes
                        </Link>
                        <Link to={`/students/edit/${student.id}`} className={`${styles.btn} ${styles.btnWarning}`}>
                          Editar
                        </Link>
                        <Link to={`/students/delete/${student.id}`} className={`${styles.btn} ${styles.btnDanger}`}>
                          Excluir
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageLink}
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Anterior
                </button>
                <span className={styles.pageInfo}>
                  Página {page} de {totalPages}
                </span>
                <button
                  className={styles.pageLink}
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        ) : (
          <p className={styles.noResults}>Nenhum aluno encontrado.</p>
        )}
      </main>
    </div>
  );
}
