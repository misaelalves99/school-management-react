// src/mocks/enrollments.ts

import type { Enrollment } from '../types/enrollment';

// Mock de matrículas
let enrollmentsData: Enrollment[] = [
  { id: 1, studentId: 1, classRoomId: 1, enrollmentDate: '2025-01-10', status: 'Ativo' },
  { id: 2, studentId: 2, classRoomId: 2, enrollmentDate: '2025-01-15', status: 'Inativo' },
  { id: 3, studentId: 1, classRoomId: 2, enrollmentDate: '2025-02-01', status: 'Ativo' },
];

// Retorna todos os enrollments
export function getEnrollments(): Enrollment[] {
  return [...enrollmentsData];
}

// Retorna um enrollment pelo id
export function getEnrollmentById(id: number): Enrollment | undefined {
  return enrollmentsData.find(e => e.id === id);
}

// Cria um novo enrollment
export function createEnrollment(data: Omit<Enrollment, 'id'>): Enrollment {
  const newEnrollment: Enrollment = {
    ...data,
    id: Math.max(0, ...enrollmentsData.map(e => e.id)) + 1,
  };
  enrollmentsData.push(newEnrollment);
  return newEnrollment;
}

// Atualiza um enrollment existente
export function updateEnrollment(id: number, updated: Partial<Enrollment>): Enrollment | null {
  const index = enrollmentsData.findIndex(e => e.id === id);
  if (index === -1) return null;
  enrollmentsData[index] = { ...enrollmentsData[index], ...updated };
  return enrollmentsData[index];
}

// Remove um enrollment pelo id
export function deleteEnrollment(id: number): void {
  enrollmentsData = enrollmentsData.filter(e => e.id !== id);
}
