// src/contexts/Students/StudentsProvider.tsx

import { useState, ReactNode } from "react";
import { StudentsContext } from "./StudentsContext";
import type { Student } from "../../types/Student";
import { getStudents, createStudent, updateStudent, deleteStudent } from "../../mocks/Students";

interface StudentsProviderProps {
  children: ReactNode;
}

export function StudentsProvider({ children }: StudentsProviderProps) {
  const [students, setStudents] = useState<Student[]>(getStudents());

  const refreshStudents = () => setStudents(getStudents());

  const addStudent = (student: Omit<Student, "id">) => {
    const newStudent = createStudent(student);
    refreshStudents();
    return newStudent;
  };

  const editStudent = (id: number, student: Partial<Student>) => {
    const updated = updateStudent(id, student);
    refreshStudents();
    return updated;
  };

  const removeStudent = (id: number) => {
    deleteStudent(id);
    refreshStudents();
  };

  return (
    <StudentsContext.Provider
      value={{ students, addStudent, editStudent, removeStudent, refreshStudents }}
    >
      {children}
    </StudentsContext.Provider>
  );
}
