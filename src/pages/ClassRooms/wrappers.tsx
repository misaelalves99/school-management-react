// src/pages/ClassRooms/wrappers.tsx

import { useParams } from 'react-router-dom';
import DeleteClassRoom from './Delete/DeletePage';
import ClassRoomDetailsPage from './Details/DetailsPage';
import EditClassRoom from './Edit/EditPage';

export const ClassRoomDeletePageWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <p>Turma não encontrada.</p>;
  const classRoomId = Number(id);

  return <DeleteClassRoom id={classRoomId} />;
};

export const ClassRoomDetailsPageWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <p>Turma não encontrada.</p>;
  const classRoomId = Number(id);

  return <ClassRoomDetailsPage id={classRoomId} />;
};

export const ClassRoomEditPageWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <p>Turma não encontrada.</p>;
  const classRoomId = Number(id);

  return <EditClassRoom id={classRoomId} />;
};
