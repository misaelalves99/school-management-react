// src/mocks/students.ts
import type { Student } from "../types/Student";

let studentsData: Student[] = [
  { id: 1, name: "João Silva", email: "joao.silva@email.com", dateOfBirth: "2000-01-15", enrollmentNumber: "20230001", phone: "123456789", address: "Rua A" },
  { id: 2, name: "Maria Oliveira", email: "maria.oliveira@email.com", dateOfBirth: "2001-03-22", enrollmentNumber: "20230002", phone: "987654321", address: "Rua B" },
  { id: 3, name: "Pedro Santos", email: "pedro.santos@email.com", dateOfBirth: "1999-07-10", enrollmentNumber: "20230003", phone: "111222333", address: "Rua C" },
];

export function getStudents(): Student[] {
  return [...studentsData];
}

export function getStudentById(id: number): Student | undefined {
  return studentsData.find(s => s.id === id);
}

export function createStudent(student: Omit<Student, "id">): Student {
  const newId = studentsData.length > 0 ? Math.max(...studentsData.map(s => s.id)) + 1 : 1;
  const newStudent: Student = { ...student, id: newId };
  studentsData.push(newStudent);
  return newStudent;
}

export function updateStudent(id: number, updated: Partial<Student>): Student | null {
  const index = studentsData.findIndex(s => s.id === id);
  if (index === -1) return null;
  studentsData[index] = { ...studentsData[index], ...updated };
  return studentsData[index];
}

export function deleteStudent(id: number): void {
  studentsData = studentsData.filter(s => s.id !== id);
}

export { studentsData as mockStudents };
