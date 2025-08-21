// src/pages/ClassRooms/Details/DetailsPage.tsx

import { Link } from 'react-router-dom';
import styles from './DetailsPage.module.css';
import { useClassRooms } from '../../../hooks/useClassRooms';
import type { Subject } from '../../../types/Subject';
import type { Teacher } from '../../../types/Teacher';
import type { ClassRoom } from '../../../types/ClassRoom';

interface Props {
  id: number;
}

const ClassRoomDetailsPage: React.FC<Props> = ({ id }) => {
  const { getById } = useClassRooms();
  const classRoom: ClassRoom | undefined = getById(id);

  if (!classRoom) return <p>Turma não encontrada.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Detalhes da Turma</h1>

      <dl className={styles.details}>
        <dt>Nome</dt>
        <dd>{classRoom.name}</dd>

        <dt>Capacidade</dt>
        <dd>{classRoom.capacity}</dd>

        <dt>Horário</dt>
        <dd>{classRoom.schedule}</dd>

        <dt>Disciplinas</dt>
        <dd>
          {classRoom.subjects?.length ? (
            <ul>
              {classRoom.subjects.map((s: Subject) => (
                <li key={s.id}>{s.name}</li>
              ))}
            </ul>
          ) : (
            <span className={styles.muted}>Sem disciplinas vinculadas.</span>
          )}
        </dd>

        <dt>Professores</dt>
        <dd>
          {classRoom.teachers?.length ? (
            <ul>
              {classRoom.teachers.map((t: Teacher) => (
                <li key={t.id}>{t.name}</li>
              ))}
            </ul>
          ) : (
            <span className={styles.muted}>Sem professores vinculados.</span>
          )}
        </dd>

        <dt>Professor Responsável</dt>
        <dd>{classRoom.classTeacher?.name ?? 'Não definido'}</dd>
      </dl>

      <div className={styles.actions}>
        <Link to={`/classrooms/edit/${classRoom.id}`} className={`${styles.btn} ${styles.btnWarning}`}>
          Editar
        </Link>
        <Link to="/classrooms" className={`${styles.btn} ${styles.btnSecondary}`}>
          Voltar
        </Link>
      </div>
    </div>
  );
};

export default ClassRoomDetailsPage;
