// src/context/ClassRooms/ClassRoomProvider.tsx

import { ReactNode, useCallback, useState } from "react";
import { ClassRoomsContext } from "./ClassRoomContext";
import type { ClassRoom } from "../../types/ClassRoom";
import {
  getClassRooms,
  getClassRoomById,
  createClassRoom,
  updateClassRoom,
  deleteClassRoom,
} from "../../mocks/classRooms";

interface Props {
  children: ReactNode;
}

export const ClassRoomsProvider: React.FC<Props> = ({ children }) => {
  const [classRooms, setClassRooms] = useState<ClassRoom[]>(getClassRooms());

  const refresh = useCallback(() => {
    setClassRooms(getClassRooms());
  }, []);

  const getById = useCallback((id: number) => getClassRoomById(id), []);

  const create = useCallback(
    (classRoom: Omit<ClassRoom, "id">) => {
      const newRoom = createClassRoom(classRoom);
      refresh();
      return newRoom;
    },
    [refresh]
  );

  const update = useCallback(
    (id: number, updated: Partial<ClassRoom>) => {
      const updatedRoom = updateClassRoom(id, updated);
      refresh();
      return updatedRoom;
    },
    [refresh]
  );

  const remove = useCallback(
    (id: number) => {
      deleteClassRoom(id);
      refresh();
    },
    [refresh]
  );

  return (
    <ClassRoomsContext.Provider
      value={{ classRooms, getById, create, update, remove, refresh }}
    >
      {children}
    </ClassRoomsContext.Provider>
  );
};
