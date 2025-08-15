// src/contexts/Subjects/SubjectsProvider.tsx

import { useState, useCallback, ReactNode } from "react";
import { SubjectsContext } from "./SubjectsContext";
import type { Subject } from "../../types/Subject";
import { mockSubjects } from "../../mocks/subjects";

interface SubjectsProviderProps {
  children: ReactNode;
}

export function SubjectsProvider({ children }: SubjectsProviderProps) {
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects.list());

  const reloadSubjects = useCallback(() => {
    setSubjects(mockSubjects.list());
  }, []);

  const createSubject = useCallback((data: Omit<Subject, "id">) => {
    const newSubject = mockSubjects.create(data);
    setSubjects(prev => [...prev, newSubject]);
    return newSubject;
  }, []);

  const updateSubject = useCallback((id: number, data: Partial<Omit<Subject, "id">>) => {
    const updated = mockSubjects.update(id, data);
    if (updated) setSubjects(prev => prev.map(s => (s.id === id ? updated : s)));
    return updated;
  }, []);

  const deleteSubject = useCallback((id: number) => {
    const deleted = mockSubjects.delete(id);
    if (deleted) setSubjects(prev => prev.filter(s => s.id !== id));
    return deleted;
  }, []);

  const getSubjectById = useCallback((id: number) => subjects.find(s => s.id === id), [subjects]);

  return (
    <SubjectsContext.Provider
      value={{
        subjects,
        createSubject,
        updateSubject,
        deleteSubject,
        getSubjectById,
        reloadSubjects,
      }}
    >
      {children}
    </SubjectsContext.Provider>
  );
}
