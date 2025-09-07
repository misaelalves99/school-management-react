// src/pages/ClassRooms/Details/DetailsPage.tsx

import { useClassRooms } from '../../../hooks/useClassRooms';
import styles from './DetailsPage.module.css';
import { useNavigate, useParams } from 'react-router-dom';

const ClassRoomDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getById } = useClassRooms();
  const navigate = useNavigate();

  if (!id) return <p>ID da turma não fornecido.</p>;

  const classRoom = getById(Number(id));
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
