// src/pages/ClassRoom/Details/DetailsPage.tsx

import { Link } from 'react-router-dom';
import styles from './DetailsPage.module.css';

type Subject = { name: string };
type Teacher = { name: string };
type ClassTeacher = { name: string };

type ClassRoom = {
  id: number;
  name: string;
  capacity: number;
  schedule: string;
  subjects?: Subject[];
  teachers?: Teacher[];
  classTeacher?: ClassTeacher | null;
};

type Props = {
  classRoom: ClassRoom;
};

const ClassRoomDetailsPage: React.FC<Props> = ({ classRoom }) => {
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
              {classRoom.subjects.map((s, i) => (
                <li key={i}>{s.name}</li>
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
              {classRoom.teachers.map((t, i) => (
                <li key={i}>{t.name}</li>
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
        <Link
          to={`/classrooms/edit/${classRoom.id}`}
          className={`${styles.btn} ${styles.btnWarning}`}
        >
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
