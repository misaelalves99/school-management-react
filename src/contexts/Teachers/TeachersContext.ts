// src/contexts/TeachersContext.ts

import { createContext } from "react";
import type { Teacher } from "../../types/Teacher";
import type { TeacherFormData } from "../../types/TeacherFormData";

export interface TeachersContextType {
  teachers: Teacher[];
  loading: boolean;
  fetchTeachers: () => void;
  getTeacher: (id: number) => Teacher | undefined;
  addTeacher: (data: TeacherFormData) => Teacher;
  editTeacher: (id: number, data: Partial<TeacherFormData>) => Teacher | null;
  removeTeacher: (id: number) => void;
}

export const TeachersContext = createContext<TeachersContextType | undefined>(undefined);
