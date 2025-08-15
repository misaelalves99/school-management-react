// src/pages/ClassRooms/index.tsx

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styles from './ClassRoomList.module.css';
import { useClassRooms } from '../../hooks/useClassRooms';
import type { ClassRoom } from '../../types/ClassRoom';

const PAGE_SIZE = 10;

const ClassroomsPage: React.FC = () => {
  const { classRooms } = useClassRooms();
  const [searchString, setSearchString] = useState('');
  const [page, setPage] = useState(1);

  const filteredData: ClassRoom[] = useMemo(() => {
    const term = searchString.toLowerCase();
    return classRooms.filter(c =>
      c.name.toLowerCase().includes(term) ||
      c.schedule.toLowerCase().includes(term) ||
      c.capacity.toString().includes(term)
    );
  }, [searchString, classRooms]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const pagedData: ClassRoom[] = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
    setPage(1);
  };

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Salas</h2>
        <form onSubmit={(e) => e.preventDefault()} className={styles.searchForm}>
          <input
            type="text"
            value={searchString}
            onChange={handleSearchChange}
            placeholder="Digite o nome, horário ou capacidade..."
          />
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Buscar</button>
        </form>

        <Link to="/classrooms/create" className={`${styles.btn} ${styles.btnSuccess}`}>
          Cadastrar Nova Sala
        </Link>
      </div>

      <div className={styles.rightPanel}>
        <h2 className={styles.title}>Lista de Salas</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Capacidade</th>
              <th>Horário</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pagedData.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhuma sala encontrada.
                </td>
              </tr>
            ) : (
              pagedData.map((room) => (
                <tr key={room.id}>
                  <td>{room.name}</td>
                  <td>{room.capacity}</td>
                  <td>{room.schedule}</td>
                  <td>
                    <Link to={`/classrooms/details/${room.id}`} className={`${styles.btn} ${styles.btnInfo}`}>Detalhes</Link>{' '}
                    <Link to={`/classrooms/edit/${room.id}`} className={`${styles.btn} ${styles.btnWarning}`}>Editar</Link>{' '}
                    <Link to={`/classrooms/delete/${room.id}`} className={`${styles.btn} ${styles.btnDanger}`}>Excluir</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button onClick={() => goToPage(page - 1)} disabled={page === 1} className={styles.pageLink}>
              Anterior
            </button>
            <span className={styles.pageInfo}>Página {page} de {totalPages}</span>
            <button onClick={() => goToPage(page + 1)} disabled={page === totalPages} className={styles.pageLink}>
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassroomsPage;
