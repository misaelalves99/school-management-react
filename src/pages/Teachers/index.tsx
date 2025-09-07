// src/pages/Teachers/index.tsx

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTeachers } from "../../hooks/useTeachers";
import styles from "./TeachersPage.module.css";

export default function TeachersPage() {
  const navigate = useNavigate();
  const { teachers } = useTeachers();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredTeachers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return teachers;
    return teachers.filter(
      t =>
        t.name.toLowerCase().includes(term) ||
        t.subject.toLowerCase().includes(term)
    );
  }, [searchTerm, teachers]);

  return (
    <div className={styles.pageContainer}>
      <aside className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Professores</h2>
        <form
          onSubmit={e => e.preventDefault()}
          className={styles.searchForm}
        >
          <input
            type="text"
            placeholder="Digite o nome ou disciplina..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={styles.input}
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
      </aside>

      <main className={styles.rightPanel}>
        <h2 className={styles.title}>Lista de Professores</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Disciplina</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={4} className={styles.noResults}>
                    Nenhum professor encontrado.
                  </td>
                </tr>
              ) : (
                filteredTeachers.map(t => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.name}</td>
                    <td>{t.subject}</td>
                    <td className={styles.actionsCell}>
                      <button
                        className={`${styles.btn} ${styles.btnInfo}`}
                        onClick={() => navigate(`/teachers/details/${t.id}`)}
                      >
                        Detalhes
                      </button>
                      <button
                        className={`${styles.btn} ${styles.btnWarning}`}
                        onClick={() => navigate(`/teachers/edit/${t.id}`)}
                      >
                        Editar
                      </button>
                      <button
                        className={`${styles.btn} ${styles.btnDanger}`}
                        onClick={() => navigate(`/teachers/delete/${t.id}`)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
