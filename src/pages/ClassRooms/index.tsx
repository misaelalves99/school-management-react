// src/pages/ClassRooms/index.tsx

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useClassRooms } from '../../hooks/useClassRooms';
import styles from './ClassRoomList.module.css';
import type { ClassRoom } from '../../types/ClassRoom';

export default function ClassroomsPage() {
  const { classRooms } = useClassRooms();
  const [searchString, setSearchString] = useState('');

  const filteredData: ClassRoom[] = useMemo(() => {
    const term = searchString.toLowerCase();
    return classRooms.filter(
      (c: ClassRoom) =>
        c.name.toLowerCase().includes(term) ||
        c.schedule.toLowerCase().includes(term) ||
        c.capacity.toString().includes(term)
    );
  }, [searchString, classRooms]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  return (
    <div className={styles.pageContainer}>
      <aside className={styles.leftPanel}>
        <h2 className={styles.title}>Buscar Salas</h2>
        <form onSubmit={e => e.preventDefault()} className={styles.searchForm}>
          <input
            type="text"
            value={searchString}
            onChange={handleSearchChange}
            placeholder="Digite nome, horário ou capacidade..."
            className={styles.input}
          />
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Buscar</button>
        </form>

        <Link to="/classrooms/create" className={`${styles.btn} ${styles.btnSuccess}`}>
          Cadastrar Nova Sala
        </Link>
      </aside>

      <main className={styles.rightPanel}>
        <h2 className={styles.title}>Lista de Salas</h2>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Capacidade</th>
                <th>Horário</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.noResults}>
                    Nenhuma sala encontrada.
                  </td>
                </tr>
              ) : (
                filteredData.map((room: ClassRoom) => (
                  <tr key={room.id}>
                    <td>{room.id}</td>
                    <td>{room.name}</td>
                    <td>{room.capacity}</td>
                    <td>{room.schedule}</td>
                    <td className={styles.actionsCell}>
                      <Link to={`/classrooms/details/${room.id}`} className={`${styles.btn} ${styles.btnInfo}`}>
                        Detalhes
                      </Link>{' '}
                      <Link to={`/classrooms/edit/${room.id}`} className={`${styles.btn} ${styles.btnWarning}`}>
                        Editar
                      </Link>{' '}
                      <Link to={`/classrooms/delete/${room.id}`} className={`${styles.btn} ${styles.btnDanger}`}>
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
