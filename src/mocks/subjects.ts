// src/mocks/subjects.ts

import type { Subject } from '../types/Subject';

let subjectsData: Subject[] = [
  { id: 1, name: "Matemática", description: "Disciplina de matemática básica", workloadHours: 60 },
  { id: 2, name: "Física", description: "Fundamentos de física moderna", workloadHours: 60 },
  { id: 3, name: "Química", description: "Introdução à química orgânica", workloadHours: 60 },
  { id: 4, name: "Biologia", description: "Biologia celular e molecular", workloadHours: 60 },
];

const getNextId = (): number => {
  return subjectsData.length > 0 ? Math.max(...subjectsData.map(s => s.id)) + 1 : 1;
};

export const mockSubjects = {
  list: (): Subject[] => [...subjectsData],
  get: (id: number): Subject | undefined => subjectsData.find(s => s.id === id),
  create: (subject: Omit<Subject, 'id'>): Subject => {
    const newSubject: Subject = { id: getNextId(), ...subject };
    subjectsData = [...subjectsData, newSubject];
    return newSubject;
  },
  update: (id: number, updated: Partial<Omit<Subject, 'id'>>): Subject | undefined => {
    const index = subjectsData.findIndex(s => s.id === id);
    if (index === -1) return undefined;
    const updatedSubject = { ...subjectsData[index], ...updated };
    subjectsData = subjectsData.map(s => s.id === id ? updatedSubject : s);
    return updatedSubject;
  },
  delete: (id: number): boolean => {
    const index = subjectsData.findIndex(s => s.id === id);
    if (index === -1) return false;
    subjectsData = subjectsData.filter(s => s.id !== id);
    return true;
  }
};
