// src/pages/Enrollments/index.tsx

import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styles from './EnrollmentsPage.module.css';

import { mockStudents } from '../../mocks/students';
import mockClassRooms from '../../mocks/classRooms';
import enrollmentsMock from '../../mocks/enrollments';
import type { EnrollmentPageData, EnrollmentWithNames } from '../../types/enrollmentPageData';

const PAGE_SIZE = 2;

export default function EnrollmentIndexPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchString, setSearchString] = useState(searchParams.get('searchString') || '');
  const currentPage = Number(searchParams.get('page') || '1');

  const [data, setData] = useState<EnrollmentPageData>({
    items: [],
    currentPage,
    totalItems: 0,
    pageSize: PAGE_SIZE,
    searchTerm: '',
  });

  useEffect(() => {
    // Filtra pelo status
    const filtered = enrollmentsMock.filter(e =>
      searchString ? e.status.toLowerCase().includes(searchString.toLowerCase()) : true
    );

    const start = (currentPage - 1) * PAGE_SIZE;
    const paginated = filtered.slice(start, start + PAGE_SIZE);

    const itemsWithNames: EnrollmentWithNames[] = paginated.map(e => ({
      ...e,
      studentName: mockStudents.find(s => s.id === e.studentId)?.name ?? 'Aluno não informado',
      classRoomName: mockClassRooms.find(c => c.id === e.classRoomId)?.name ?? 'Turma não informada',
    }));

    setData({
      items: itemsWithNames,
      currentPage,
      totalItems: filtered.length,
      pageSize: PAGE_SIZE,
      searchTerm: searchString,
    });
  }, [searchString, currentPage]);

  const totalPages = useMemo(() => Math.ceil(data.totalItems / data.pageSize), [
    data.totalItems,
    data.pageSize,
  ]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Matrículas</h2>
        <form
          className={styles.searchForm}
          onSubmit={e => {
            e.preventDefault();
            setSearchParams({ searchString, page: '1' });
          }}
        >
          <input
            type="text"
            value={searchString}
            placeholder="Buscar Matrícula ou Status..."
            onChange={e => setSearchString(e.target.value)}
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
            {data.items.map(e => (
              <tr key={e.id}>
                <td>{e.studentName}</td>
                <td>{e.classRoomName}</td>
                <td>{e.status}</td>
                <td>{new Date(e.enrollmentDate).toLocaleDateString()}</td>
                <td>
                  <Link to={`/enrollments/details/${e.id}`} className={`${styles.btn} ${styles.btnInfo}`}>
                    Detalhes
                  </Link>{' '}
                  <Link to={`/enrollments/edit/${e.id}`} className={`${styles.btn} ${styles.btnWarning}`}>
                    Editar
                  </Link>{' '}
                  <Link to={`/enrollments/delete/${e.id}`} className={`${styles.btn} ${styles.btnDanger}`}>
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
