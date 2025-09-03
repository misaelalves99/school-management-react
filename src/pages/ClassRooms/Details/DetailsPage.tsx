// src/pages/ClassRooms/Details/DetailsPage.tsx

import { useClassRooms } from '../../../hooks/useClassRooms';
import type { Subject } from '../../../types/Subject';
import type { Teacher } from '../../../types/Teacher';
import styles from './DetailsPage.module.css';
import { useNavigate } from 'react-router-dom';

interface Props {
  id: number;
}

const ClassRoomDetailsPage: React.FC<Props> = ({ id }) => {
  const { getById } = useClassRooms();
  const navigate = useNavigate();
  const classRoom = getById(id);

  if (!classRoom) return <p>Turma não encontrada.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Detalhes da Turma</h1>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Nome:</span>
        <span className={styles.detailsValue}>{classRoom.name}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Capacidade:</span>
        <span className={styles.detailsValue}>{classRoom.capacity}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Horário:</span>
        <span className={styles.detailsValue}>{classRoom.schedule}</span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Disciplinas:</span>
        <span className={styles.detailsValue}>
          {classRoom.subjects?.length ? (
            <ul>
              {classRoom.subjects.map((s: Subject) => (
                <li key={s.id}>{s.name}</li>
              ))}
            </ul>
          ) : (
            <span className={styles.muted}>Sem disciplinas vinculadas</span>
          )}
        </span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Professores:</span>
        <span className={styles.detailsValue}>
          {classRoom.teachers?.length ? (
            <ul>
              {classRoom.teachers.map((t: Teacher) => (
                <li key={t.id}>{t.name}</li>
              ))}
            </ul>
          ) : (
            <span className={styles.muted}>Sem professores vinculados</span>
          )}
        </span>
      </div>

      <div className={styles.detailsRow}>
        <span className={styles.detailsLabel}>Professor Responsável:</span>
        <span className={styles.detailsValue}>
          {classRoom.classTeacher?.name ?? 'Não definido'}
        </span>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.btnWarning}
          onClick={() => navigate(`/classrooms/edit/${classRoom.id}`)}
        >
          Editar
        </button>
        <button
          className={styles.btnSecondary}
          onClick={() => navigate('/classrooms')}
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

export default ClassRoomDetailsPage;
