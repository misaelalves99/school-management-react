// src/contexts/TeachersProvider.tsx

import { useState, useEffect, ReactNode } from "react";
import { TeachersContext } from "./TeachersContext";
import type { Teacher } from "../../types/Teacher";
import type { TeacherFormData } from "../../types/TeacherFormData";
import { getTeachers, getTeacherById, createTeacher, updateTeacher, deleteTeacher } from "../../mocks/Teachers";

interface Props { children: ReactNode }

export function TeachersProvider({ children }: Props) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = () => {
    setLoading(true);
    setTeachers(getTeachers());
    setLoading(false);
  };

  const getTeacher = (id: number) => getTeacherById(id);
  const addTeacher = (data: TeacherFormData) => { const t = createTeacher(data); setTeachers(prev => [...prev, t]); return t; };
  const editTeacher = (id: number, data: Partial<TeacherFormData>) => {
    const updated = updateTeacher(id, data);
    if (updated) setTeachers(prev => prev.map(t => t.id === id ? updated : t));
    return updated;
  };
  const removeTeacher = (id: number) => { deleteTeacher(id); setTeachers(prev => prev.filter(t => t.id !== id)); };

  useEffect(() => { fetchTeachers(); }, []);

  return <TeachersContext.Provider value={{ teachers, loading, fetchTeachers, getTeacher, addTeacher, editTeacher, removeTeacher }}>{children}</TeachersContext.Provider>;
}
