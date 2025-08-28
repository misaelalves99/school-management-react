// src/pages/ClassRooms/Delete/DeletePage.tsx

import { useNavigate } from 'react-router-dom';
import styles from './DeletePage.module.css';
import { useClassRooms } from '../../../hooks/useClassRooms';
import type { Subject } from '../../../types/Subject';
import type { Teacher } from '../../../types/Teacher';

interface Props {
  id: number;
}

const DeleteClassRoom: React.FC<Props> = ({ id }) => {
  const navigate = useNavigate();
  const { getById, remove } = useClassRooms();
  const classRoom = getById(id);

  if (!classRoom) return <p>Turma não encontrada.</p>;

  const handleDelete = () => {
    try {
      remove(classRoom.id);
      alert('Turma excluída com sucesso!');
      navigate('/classrooms');
    } catch {
      alert('Erro ao excluir a turma.');
    }
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
          {classRoom.subjects?.length ? (
            <ul>
              {classRoom.subjects.map((subj: Subject) => (
                <li key={subj.id}>{subj.name}</li>
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
      </dl>

      <div className={styles.actions}>
        <button type="button" className={styles.btnDanger} onClick={handleDelete}>
          Confirmar Exclusão
        </button>
        <button type="button" className={styles.btnSecondary} onClick={() => navigate('/classrooms')}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default DeleteClassRoom;
