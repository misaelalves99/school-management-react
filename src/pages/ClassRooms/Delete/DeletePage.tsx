// src/pages/ClassRoom/Delete/DeletePage.tsx

import { Link } from 'react-router-dom';
import styles from './DeletePage.module.css';
import { ClassRoom } from '../../../types/ClassRoom';

type Props = {
  classRoom: ClassRoom;
  onDelete: (id: number) => void;
};

const DeleteClassRoom: React.FC<Props> = ({ classRoom, onDelete }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDelete(classRoom.id);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Excluir Turma</h1>

      <p className={styles.warning}>Tem certeza que deseja excluir esta turma?</p>

      <dl className={styles.details}>
        <dt>Nome</dt>
        <dd>{classRoom.name}</dd>

        <dt>Capacidade</dt>
        <dd>{classRoom.capacity}</dd>

        <dt>Horário</dt>
        <dd>{classRoom.schedule}</dd>

        <dt>Disciplinas</dt>
        <dd>
          {classRoom.subjects && classRoom.subjects.length > 0 ? (
            <ul>
              {classRoom.subjects.map((subj, idx) => (
                <li key={idx}>{subj.name}</li>
              ))}
            </ul>
          ) : (
            <span className={styles.muted}>Sem disciplinas vinculadas.</span>
          )}
        </dd>

        <dt>Professores</dt>
        <dd>
          {classRoom.teachers && classRoom.teachers.length > 0 ? (
            <ul>
              {classRoom.teachers.map((t, idx) => (
                <li key={idx}>{t.name}</li>
              ))}
            </ul>
          ) : (
            <span className={styles.muted}>Sem professores vinculados.</span>
          )}
        </dd>
      </dl>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="hidden" value={classRoom.id} />
        <button type="submit" className={styles.btnDanger}>
          Confirmar Exclusão
        </button>
        <Link to="/classrooms" className={styles.btnSecondary}>
          Cancelar
        </Link>
      </form>
    </div>
  );
};

export default DeleteClassRoom;
