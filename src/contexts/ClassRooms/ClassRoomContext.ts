// src/context/ClassRoomContext.tsx

import { createContext } from "react";
import type { ClassRoom } from "../../types/ClassRoom";

export interface ClassRoomsContextType {
  classRooms: ClassRoom[];
  getById: (id: number) => ClassRoom | undefined;
  create: (classRoom: Omit<ClassRoom, "id">) => ClassRoom;
  update: (id: number, updated: Partial<ClassRoom>) => ClassRoom | null;
  remove: (id: number) => void;
  refresh: () => void;
}

export const ClassRoomsContext = createContext<ClassRoomsContextType | undefined>(undefined);
