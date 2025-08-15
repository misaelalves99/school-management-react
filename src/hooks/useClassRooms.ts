// src/hooks/useClassRooms.ts

import { useContext } from "react";
import { ClassRoomsContext, ClassRoomsContextType } from "../contexts/ClassRooms/ClassRoomContext";

export function useClassRooms(): ClassRoomsContextType {
  const context = useContext(ClassRoomsContext);
  if (!context) {
    throw new Error("useClassRooms deve ser usado dentro de um ClassRoomsProvider");
  }
  return context;
}
