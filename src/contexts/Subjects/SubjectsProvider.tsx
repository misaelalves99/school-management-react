// src/contexts/Subjects/SubjectsProvider.tsx

import { useState, ReactNode } from "react";
import { SubjectsContext, SubjectsContextData } from "./SubjectsContext";
import type { Subject } from "../../types/subject";
import { mockSubjects } from "../../mocks/Subjects";

interface SubjectsProviderProps {
  children: ReactNode;
}

export function SubjectsProvider({ children }: SubjectsProviderProps) {
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects.list());

  const reloadSubjects = () => setSubjects(mockSubjects.list());

  const createSubject = (data: Omit<Subject, "id">) => {
    const created = mockSubjects.create(data);
    reloadSubjects();
    return created;
  };

  const updateSubject = (id: number, data: Partial<Omit<Subject, "id">>) => {
    const updated = mockSubjects.update(id, data);
    reloadSubjects();
    return updated;
  };

  const deleteSubject = (id: number) => {
    const deleted = mockSubjects.delete(id);
    reloadSubjects();
    return deleted;
  };

  const getSubjectById = (id: number) => mockSubjects.get(id);

  const contextValue: SubjectsContextData = {
    subjects,
    createSubject,
    updateSubject,
    deleteSubject,
    getSubjectById,
    reloadSubjects,
  };

  return <SubjectsContext.Provider value={contextValue}>{children}</SubjectsContext.Provider>;
}
