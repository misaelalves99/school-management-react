// src/pages/Subjects/index.tsx

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styles from './SubjectsPage.module.css';
import { useSubjects } from '../../hooks/useSubjects';

export default function SubjectsIndexPage() {
  const [search, setSearch] = useState('');

  const { subjects } = useSubjects();

  // filtra usando memo para otimização
  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return subjects.filter(
      s =>
        s.name.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term)
    );
  }, [subjects, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
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
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Carga Horária</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhuma disciplina encontrada.
                </td>
              </tr>
            ) : (
              filtered.map(subject => (
                <tr key={subject.id}>
                  <td>{subject.id}</td>
                  <td>{subject.name}</td>
                  <td>{subject.description}</td>
                  <td>{subject.workloadHours}</td>
                  <td>
                    <Link to={`/subjects/details/${subject.id}`} className={`${styles.btn} ${styles.btnInfo}`}>
                      Detalhes
                    </Link>{' '}
                    <Link to={`/subjects/edit/${subject.id}`} className={`${styles.btn} ${styles.btnWarning}`}>
                      Editar
                    </Link>{' '}
                    <Link to={`/subjects/delete/${subject.id}`} className={`${styles.btn} ${styles.btnDanger}`}>
                      Excluir
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
