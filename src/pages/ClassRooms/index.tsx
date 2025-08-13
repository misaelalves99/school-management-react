// /src/pages/ClassRooms/index.tsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ClassRoomList.module.css';
import mockClassRooms from '../../mocks/classRooms';
import type { ClassRoom } from '../../types/Classroom';

const ClassroomsPage: React.FC = () => {
  const [searchString, setSearchString] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 2;

  const filteredData: ClassRoom[] = mockClassRooms.filter((c) =>
    c.name.toLowerCase().includes(searchString.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const pagedData: ClassRoom[] = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Salas</h2>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            placeholder="Digite o nome ou capacidade..."
          />
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            Buscar
          </button>
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
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pagedData.map((room) => (
              <tr key={room.id}>
                <td>{room.name}</td>
                <td>{room.capacity}</td>
                <td>
                  <Link
                    to={`/classrooms/edit/${room.id}`}
                    className={`${styles.btn} ${styles.btnWarning}`}
                  >
                    Editar
                  </Link>
                  <Link
                    to={`/classrooms/details/${room.id}`}
                    className={`${styles.btn} ${styles.btnInfo}`}
                  >
                    Detalhes
                  </Link>
                  <Link
                    to={`/classrooms/delete/${room.id}`}
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
          {page > 1 && (
            <button className={styles.pageLink} onClick={() => setPage(page - 1)}>
              Anterior
            </button>
          )}
          <span className={styles.pageInfo}>
            Página {page} de {totalPages}
          </span>
          {page < totalPages && (
            <button className={styles.pageLink} onClick={() => setPage(page + 1)}>
              Próxima
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassroomsPage;
