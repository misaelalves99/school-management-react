// src/hooks/useTeachers.ts

import { useContext } from "react";
import { TeachersContext, TeachersContextType } from "../contexts/Teachers/TeachersContext";

export function useTeachers(): TeachersContextType {
  const context = useContext(TeachersContext);
  if (!context) throw new Error("useTeachers deve ser usado dentro de um TeachersProvider");
  return context;
}
