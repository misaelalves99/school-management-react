// src/pages/Enrollments/index.tsx

// src/pages/Enrollments/index.tsx

import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styles from './EnrollmentsPage.module.css';

import { mockStudents } from '../../mocks/students';
// CORREÇÃO: Altere a importação para usar exportação nomeada
import { mockClassRooms } from '../../mocks/classRooms';
import enrollmentsMock from '../../mocks/enrollments';
import type { EnrollmentPageData, EnrollmentWithNames } from '../../types/enrollmentPageData';

const PAGE_SIZE = 10;

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
    const filtered = enrollmentsMock.filter(e =>
      searchString
        ? e.status.toLowerCase().includes(searchString.toLowerCase())
        : true
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

  const totalPages = useMemo(() => Math.max(1, Math.ceil(data.totalItems / data.pageSize)), [
    data.totalItems,
    data.pageSize,
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
    setSearchParams({ searchString: e.target.value, page: '1' });
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Matrículas</h2>
        <form
          className={styles.searchForm}
          onSubmit={e => e.preventDefault()}
        >
          <input
            type="text"
            value={searchString}
            placeholder="Buscar Matrícula ou Status..."
            onChange={handleSearchChange}
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
            {data.items.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhuma matrícula encontrada.
                </td>
              </tr>
            ) : (
              data.items.map(e => (
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
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <Link
              to={`?page=${Math.max(1, data.currentPage - 1)}&searchString=${searchString}`}
              className={styles.pageLink}
              aria-disabled={data.currentPage === 1}
            >
              Anterior
            </Link>

            <span className={styles.pageInfo}>
              Página {data.currentPage} de {totalPages}
            </span>

            <Link
              to={`?page=${Math.min(totalPages, data.currentPage + 1)}&searchString=${searchString}`}
              className={styles.pageLink}
              aria-disabled={data.currentPage === totalPages}
            >
              Próxima
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
