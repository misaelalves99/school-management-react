// src/pages/ClassRooms/wrappers.tsx

import { useParams, useNavigate } from 'react-router-dom';

import DeleteClassRoom from './Delete/DeletePage';
import ClassRoomDetailsPage from './Details/DetailsPage';
import EditClassRoom from './Edit/EditPage';

import mockClassRooms from '../../mocks/classRooms';

export const ClassRoomDeletePageWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const classRoomId = Number(id);
  const classRoom = mockClassRooms.find((c) => c.id === classRoomId);

  if (!classRoom) return <p>Turma não encontrada.</p>;

  const handleDelete = (id: number) => {
    console.log('Excluir turma com id', id);
    // Implementar exclusão real via API
    navigate('/classrooms');
  };

  return <DeleteClassRoom classRoom={classRoom} onDelete={handleDelete} />;
};

export const ClassRoomDetailsPageWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const classRoomId = Number(id);
  const classRoom = mockClassRooms.find((c) => c.id === classRoomId);

  if (!classRoom) return <p>Turma não encontrada.</p>;

  return <ClassRoomDetailsPage classRoom={classRoom} />;
};

export const ClassRoomEditPageWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const classRoomId = Number(id);
  const classRoom = mockClassRooms.find((c) => c.id === classRoomId);

  if (!classRoom) return <p>Turma não encontrada.</p>;

  const handleSubmit = (data: { id: number; name: string; capacity: number }) => {
    console.log('Salvar turma', data);
    // Implementar atualização real via API
    navigate('/classrooms');
  };

  return (
    <EditClassRoom
      id={classRoom.id}
      name={classRoom.name}
      capacity={classRoom.capacity}
      onSubmit={handleSubmit}
    />
  );
};
