// src/contexts/ClassRooms/ClassRoomProvider.tsx

import { ReactNode, useCallback, useState } from "react";
import { ClassRoomContext } from "./ClassRoomContext";
import type { ClassRoom } from "../../types/ClassRoom";
import {
  getClassRooms as getMockClassRooms,
  createClassRoom as createMockClassRoom,
  updateClassRoom as updateMockClassRoom,
  deleteClassRoom as deleteMockClassRoom,
} from "../../mocks/ClassRooms";

interface Props {
  children: ReactNode;
}

export const ClassRoomProvider: React.FC<Props> = ({ children }) => {
  const [classRooms, setClassRooms] = useState<ClassRoom[]>(getMockClassRooms());

  const refresh = useCallback(() => {
    setClassRooms(getMockClassRooms());
  }, []);

  const create = useCallback((data: Omit<ClassRoom, 'id'>) => {
    const newClassRoom = createMockClassRoom(data);
    refresh();
    return newClassRoom;
  }, [refresh]);

  const update = useCallback((id: number, data: Partial<ClassRoom>) => {
    const updated = updateMockClassRoom(id, data);
    refresh();
    return updated;
  }, [refresh]);

  const remove = useCallback((id: number) => {
    deleteMockClassRoom(id);
    refresh();
  }, [refresh]);

  const getById = useCallback((id: number) => {
    return classRooms.find(cr => cr.id === id);
  }, [classRooms]);

  return (
    <ClassRoomContext.Provider value={{ classRooms, refresh, create, update, remove, getById }}>
      {children}
    </ClassRoomContext.Provider>
  );
};
