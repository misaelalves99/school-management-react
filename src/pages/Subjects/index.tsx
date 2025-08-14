// src/pages/Subjects/index.tsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './SubjectsPage.module.css';
import { mockSubjects } from '../../mocks/subjects';
import type { Subject } from '../../types/Subject';

const PAGE_SIZE = 10;

export default function SubjectsIndexPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // carregar do mock quando o componente monta
  useEffect(() => {
    setSubjects(mockSubjects.list()); // <-- usa o método list()
  }, []);

  // filtrar os dados com base no search
  const filtered: Subject[] = subjects.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // paginar
  const paginated: Subject[] = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Disciplinas</h2>
        <form onSubmit={(e) => e.preventDefault()} className={styles.searchForm}>
          <input
            type="text"
            value={search}
            placeholder="Digite o nome ou descrição..."
            onChange={handleSearchChange}
          />
          <button className={`${styles.btn} ${styles.btnPrimary}`}>Buscar</button>
        </form>

        <Link to="/subjects/create" className={`${styles.btn} ${styles.btnSuccess}`}>
          Cadastrar Nova Disciplina
        </Link>
      </div>

      <div className={styles.rightPanel}>
        <h2 className={styles.title}>Lista de Disciplinas</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Carga Horária</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhuma disciplina encontrada.
                </td>
              </tr>
            ) : (
              paginated.map((subject) => (
                <tr key={subject.id}>
                  <td>{subject.name}</td>
                  <td>{subject.description}</td>
                  <td>{subject.workloadHours}</td>
                  <td>
                    <Link to={`/subjects/details/${subject.id}`} className={`${styles.btn} ${styles.btnInfo}`}>Detalhes</Link>{' '}
                    <Link to={`/subjects/edit/${subject.id}`} className={`${styles.btn} ${styles.btnWarning}`}>Editar</Link>{' '}
                    <Link to={`/subjects/delete/${subject.id}`} className={`${styles.btn} ${styles.btnDanger}`}>Excluir</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button onClick={() => goToPage(page - 1)} disabled={page === 1} className={styles.pageLink}>Anterior</button>
            <span className={styles.pageInfo}>Página {page} de {totalPages}</span>
            <button onClick={() => goToPage(page + 1)} disabled={page === totalPages} className={styles.pageLink}>Próxima</button>
          </div>
        )}
      </div>
    </div>
  );
}
