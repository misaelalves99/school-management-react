// src/contexts/ClassRooms/ClassRoomContext.ts

import { createContext } from 'react';
import type { ClassRoom } from '../../types/classroom';

export interface ClassRoomContextType {
  classRooms: ClassRoom[];
  refresh: () => void;
  create: (data: Omit<ClassRoom, 'id'>) => ClassRoom;
  update: (id: number, data: Partial<ClassRoom>) => ClassRoom | null;
  remove: (id: number) => void;
  getById: (id: number) => ClassRoom | undefined;
}

export const ClassRoomContext = createContext<ClassRoomContextType | undefined>(undefined);
