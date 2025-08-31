// src/pages/ClassRooms/Delete/DeletePage.tsx

import { useNavigate } from 'react-router-dom';
import styles from './DeletePage.module.css';
import { useClassRooms } from '../../../hooks/useClassRooms';

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
      <h3 className={styles.warning}>
        Tem certeza que deseja excluir <strong>{classRoom.name}</strong>?
      </h3>

      <div className={styles.actions}>
        <button type="button" className={styles.btnDanger} onClick={handleDelete}>
          Excluir
        </button>
        <button type="button" className={styles.btnSecondary} onClick={() => navigate('/classrooms')}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default DeleteClassRoom;
