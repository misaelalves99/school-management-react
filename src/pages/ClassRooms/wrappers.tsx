// src/pages/ClassRooms/wrappers.tsx

import DeleteClassRoom from './Delete/DeletePage';
import ClassRoomDetailsPage from './Details/DetailsPage';
import EditClassRoom from './Edit/EditPage';

// Wrapper para a página de exclusão
export const ClassRoomDeletePageWrapper: React.FC = () => {
  return <DeleteClassRoom />;
};

// Wrapper para a página de detalhes
export const ClassRoomDetailsPageWrapper: React.FC = () => {
  return <ClassRoomDetailsPage />;
};

// Wrapper para a página de edição
export const ClassRoomEditPageWrapper: React.FC = () => {
  return <EditClassRoom />;
};
