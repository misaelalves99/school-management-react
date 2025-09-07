// src/contexts/Subjects/SubjectsContext.ts

import { createContext } from "react";
import type { Subject } from "../../types/subject";

export interface SubjectsContextData {
  subjects: Subject[];
  createSubject: (data: Omit<Subject, "id">) => Subject;
  updateSubject: (id: number, data: Partial<Omit<Subject, "id">>) => Subject | undefined;
  deleteSubject: (id: number) => boolean;
  getSubjectById: (id: number) => Subject | undefined;
  reloadSubjects: () => void;
}

export const SubjectsContext = createContext<SubjectsContextData | undefined>(undefined);
