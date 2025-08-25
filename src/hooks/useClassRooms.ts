// src/hooks/useClassRooms.ts

import { useContext } from "react";
import { ClassRoomContext, ClassRoomContextType } from "../contexts/ClassRooms/ClassRoomContext";

export function useClassRooms(): ClassRoomContextType {
  const context = useContext(ClassRoomContext);
  if (!context) {
    throw new Error("useClassRooms deve ser usado dentro de um ClassRoomsProvider");
  }
  return context;
}
