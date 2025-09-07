// src/mocks/subjects.ts
import type { Subject } from "../types/subject";

let subjectsData: Subject[] = [
  { id: 1, name: "Matemática", description: "Álgebra e geometria", workloadHours: 60 },
  { id: 2, name: "Física", description: "Mecânica e termodinâmica", workloadHours: 50 },
];

export const mockSubjects = {
  list: (): Subject[] => [...subjectsData],

  create: (data: Omit<Subject, "id">): Subject => {
    const newId = subjectsData.length ? Math.max(...subjectsData.map(s => s.id)) + 1 : 1;
    const newSubject: Subject = { ...data, id: newId };
    subjectsData.push(newSubject);
    return newSubject;
  },

  update: (id: number, data: Partial<Omit<Subject, "id">>): Subject | undefined => {
    const index = subjectsData.findIndex(s => s.id === id);
    if (index === -1) return undefined;
    subjectsData[index] = { ...subjectsData[index], ...data };
    return subjectsData[index];
  },

  delete: (id: number): boolean => {
    const originalLength = subjectsData.length;
    subjectsData = subjectsData.filter(s => s.id !== id);
    return subjectsData.length < originalLength;
  },

  get: (id: number): Subject | undefined => subjectsData.find(s => s.id === id), // renomeado para get
};
