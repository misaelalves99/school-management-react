// src/pages/Teachers/index.tsx

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TeachersPage.module.css";
import type { Teacher } from "../../types/Teacher";
import { getTeachers } from "../../mocks/teachers";

const PAGE_SIZE = 10; // <-- limite máximo por página

export default function TeachersPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const allTeachers = getTeachers();

  const filteredTeachers = useMemo(() => {
    if (!searchTerm.trim()) return allTeachers;
    const term = searchTerm.toLowerCase();
    return allTeachers.filter(
      t =>
        t.name.toLowerCase().includes(term) ||
        t.subject.toLowerCase().includes(term)
    );
  }, [searchTerm, allTeachers]);

  const totalItems = filteredTeachers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  const currentItems = filteredTeachers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Professores</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            goToPage(1);
          }}
          className={styles.searchForm}
          role="search"
          aria-label="Buscar professores"
        >
          <input
            type="text"
            name="searchString"
            placeholder="Digite o nome ou disciplina..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
            aria-label="Campo de busca de professores"
          />
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            Buscar
          </button>
        </form>

        <button
          className={`${styles.btn} ${styles.btnSuccess}`}
          onClick={() => navigate("/teachers/create")}
        >
          Cadastrar Novo Professor
        </button>
      </div>

      <div className={styles.rightPanel}>
        <h2 className={styles.title}>Lista de Professores</h2>

        <table className={styles.table} aria-label="Lista de professores">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Disciplina</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                  Nenhum professor encontrado.
                </td>
              </tr>
            ) : (
              currentItems.map((teacher: Teacher) => (
                <tr key={teacher.id}>
                  <td>{teacher.name}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.subject}</td>
                  <td>
                    <button
                      className={`${styles.btn} ${styles.btnInfo}`}
                      onClick={() => navigate(`/teachers/details/${teacher.id}`)}
                    >
                      Detalhes
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnWarning}`}
                      onClick={() => navigate(`/teachers/edit/${teacher.id}`)}
                    >
                      Editar
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnDanger}`}
                      onClick={() => navigate(`/teachers/delete/${teacher.id}`)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.pageLink}
              aria-label="Página anterior"
            >
              Anterior
            </button>

            <span className={styles.pageInfo}>
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={styles.pageLink}
              aria-label="Próxima página"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
