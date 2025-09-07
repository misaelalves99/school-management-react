// src/contexts/Students/StudentsContext.ts

import { createContext } from "react";
import type { Student } from "../../types/student";

export interface StudentsContextType {
  students: Student[];
  addStudent: (student: Omit<Student, "id">) => Student;
  editStudent: (id: number, student: Partial<Student>) => Student | null;
  removeStudent: (id: number) => void;
  refreshStudents: () => void;
}

export const StudentsContext = createContext<StudentsContextType | undefined>(undefined);
