// src/hooks/useStudents.ts

import { useContext } from "react";
import { StudentsContext, StudentsContextType } from "../contexts/Students/StudentsContext";

export function useStudents(): StudentsContextType {
  const context = useContext(StudentsContext);
  if (!context) {
    throw new Error("useStudents must be used within a StudentsProvider");
  }
  return context;
}
