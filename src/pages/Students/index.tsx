// src/pages/Students/index.tsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './StudentsPage.module.css';
import { Student } from '../../types/Student';

// Importa os dados de mock
import { mockStudents } from '../../mocks/students';

export default function StudentIndex() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchStudents = () => {
      const filtered = mockStudents.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase())
      );
      const pageSize = 10;
      const start = (page - 1) * pageSize;
      const paginated = filtered.slice(start, start + pageSize);
      setStudents(paginated);
      setTotalPages(Math.ceil(filtered.length / pageSize));
    };

    fetchStudents();
  }, [search, page]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Alunos</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            setPage(1);
          }}
          className={styles.searchForm}
        >
          <input
            type="text"
            placeholder="Digite o nome..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            Buscar
          </button>
        </form>
        <Link to="/students/create" className={`${styles.btn} ${styles.btnSuccess}`}>
          Cadastrar Novo Aluno
        </Link>
      </div>

      <div className={styles.rightPanel}>
        <h2 className={styles.title}>Lista de Alunos</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Matrícula</th>
              <th>Telefone</th>
              <th>Endereço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.enrollmentNumber}</td>
                <td>{student.phone || '-'}</td>
                <td>{student.address || '-'}</td>
                <td>
                  <Link to={`/students/details/${student.id}`} className={`${styles.btn} ${styles.btnInfo}`}>Detalhes</Link>
                  <Link to={`/students/edit/${student.id}`} className={`${styles.btn} ${styles.btnWarning}`}>Editar</Link>
                  <Link to={`/students/delete/${student.id}`} className={`${styles.btn} ${styles.btnDanger}`}>Excluir</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.pagination}>
          {page > 1 && (
            <button className={styles.pageLink} onClick={() => setPage(p => p - 1)}>Anterior</button>
          )}
          <span className={styles.pageInfo}>Página {page} de {totalPages}</span>
          {page < totalPages && (
            <button className={styles.pageLink} onClick={() => setPage(p => p + 1)}>Próxima</button>
          )}
        </div>
      </div>
    </div>
  );
}
