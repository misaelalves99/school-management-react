// src/pages/Enrollments/index.tsx

import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styles from './EnrollmentsPage.module.css';

import { mockStudents } from '../../mocks/students';
import classRooms from '../../mocks/classRooms';
import enrollments, { Enrollment } from '../../mocks/enrollments';

const PAGE_SIZE = 2;

export default function EnrollmentIndexPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchString, setSearchString] = useState(searchParams.get('searchString') || '');

  const currentPage = Number(searchParams.get('page') || '1');

  const [data, setData] = useState({
    items: [] as Enrollment[],
    currentPage,
    totalItems: 0,
    pageSize: PAGE_SIZE,
    searchTerm: '',
  });

  useEffect(() => {
    let filtered = enrollments;

    if (searchString) {
      const lowerSearch = searchString.toLowerCase();
      filtered = filtered.filter((e) =>
        e.status.toLowerCase().includes(lowerSearch)
      );
    }

    const start = (currentPage - 1) * PAGE_SIZE;
    const paginatedItems = filtered.slice(start, start + PAGE_SIZE);

    setData({
      items: paginatedItems,
      currentPage,
      totalItems: filtered.length,
      pageSize: PAGE_SIZE,
      searchTerm: searchString,
    });
  }, [searchString, currentPage]);

  const totalPages = useMemo(
    () => Math.ceil(data.totalItems / data.pageSize),
    [data.totalItems, data.pageSize]
  );

  const getStudentName = (id: number) =>
    mockStudents.find((s) => s.id === id)?.name ?? 'Aluno não informado';

  const getClassRoomName = (id: number) =>
    classRooms.find((c) => c.id === id)?.name ?? 'Turma não informada';

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Matrículas</h2>
        <form
          className={styles.searchForm}
          onSubmit={(e) => {
            e.preventDefault();
            setSearchParams({ searchString, page: '1' });
          }}
        >
          <input
            type="text"
            value={searchString}
            placeholder="Buscar Matrícula ou Status..."
            onChange={(e) => setSearchString(e.target.value)}
          />
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            Buscar
          </button>
        </form>

        <Link to="/enrollments/create" className={`${styles.btn} ${styles.btnSuccess}`}>
          Cadastrar Nova Matrícula
        </Link>
      </div>

      <div className={styles.rightPanel}>
        <h2 className={styles.title}>Lista de Matrículas</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Turma</th>
              <th>Status</th>
              <th>Data da Matrícula</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((enrollment) => (
              <tr key={enrollment.id}>
                <td>{getStudentName(enrollment.studentId)}</td>
                <td>{getClassRoomName(enrollment.classRoomId)}</td>
                <td>{enrollment.status}</td>
                <td>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</td>
                <td>
                  <Link
                    to={`/enrollments/details/${enrollment.id}`}
                    className={`${styles.btn} ${styles.btnInfo}`}
                  >
                    Detalhes
                  </Link>{' '}
                  <Link
                    to={`/enrollments/edit/${enrollment.id}`}
                    className={`${styles.btn} ${styles.btnWarning}`}
                  >
                    Editar
                  </Link>{' '}
                  <Link
                    to={`/enrollments/delete/${enrollment.id}`}
                    className={`${styles.btn} ${styles.btnDanger}`}
                  >
                    Excluir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.pagination}>
          {data.currentPage > 1 && (
            <Link
              to={`?page=${data.currentPage - 1}&searchString=${searchString}`}
              className={styles.pageLink}
            >
              Anterior
            </Link>
          )}

          <span className={styles.pageInfo}>
            Página {data.currentPage} de {totalPages}
          </span>

          {data.currentPage < totalPages && (
            <Link
              to={`?page=${data.currentPage + 1}&searchString=${searchString}`}
              className={styles.pageLink}
            >
              Próxima
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
