// src/pages/Enrollments/index.tsx

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styles from './EnrollmentsPage.module.css';
import { useEnrollments } from '../../hooks/useEnrollments';
import { useStudents } from '../../hooks/useStudents';
import { useClassRooms } from '../../hooks/useClassRooms';
import type { EnrollmentWithNames } from '../../types/EnrollmentWithNames';

export default function EnrollmentIndexPage() {
  const { enrollments } = useEnrollments();
  const { students = [] } = useStudents();
  const { classRooms = [] } = useClassRooms();
  const [searchString, setSearchString] = useState('');

  const filteredData: EnrollmentWithNames[] = useMemo(() => {
    const term = searchString.toLowerCase();

    return enrollments
      .filter(e => term === '' || e.status.toLowerCase().includes(term))
      .map(e => {
        const student = students.find(s => s.id === e.studentId);
        const classRoom = classRooms.find(c => c.id === e.classRoomId);
        return {
          ...e,
          studentName: student?.name ?? 'Aluno não informado',
          classRoomName: classRoom?.name ?? 'Turma não informada',
        };
      });
  }, [enrollments, students, classRooms, searchString]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  return (
    <div className={styles.pageContainer}>
      <aside className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Matrículas</h2>
        <form className={styles.searchForm} onSubmit={e => e.preventDefault()}>
          <input
            type="text"
            value={searchString}
            placeholder="Buscar Matrícula ou Status..."
            onChange={handleSearchChange}
            className={styles.input}
          />
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Buscar</button>
        </form>

        <Link to="/enrollments/create" className={`${styles.btn} ${styles.btnSuccess}`}>
          Cadastrar Nova Matrícula
        </Link>
      </aside>

      <main className={styles.rightPanel}>
        <h2 className={styles.title}>Lista de Matrículas</h2>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Aluno</th>
                <th>Turma</th>
                <th>Status</th>
                <th>Data da Matrícula</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.noResults}>
                    Nenhuma matrícula encontrada.
                  </td>
                </tr>
              ) : (
                filteredData.map(e => (
                  <tr key={e.id}>
                    <td>{e.id}</td>
                    <td>{e.studentName}</td>
                    <td>{e.classRoomName}</td>
                    <td>{e.status}</td>
                    <td>{new Date(e.enrollmentDate).toLocaleDateString()}</td>
                    <td className={styles.actionsCell}>
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
        </div>
      </main>
    </div>
  );
}
