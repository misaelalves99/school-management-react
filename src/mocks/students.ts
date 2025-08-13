// src/mocks/students.ts

import { Student } from '../types/Student';

export const mockStudents: Student[] = [
  { id: 1, name: 'João Silva', email: 'joao.silva@email.com', dateOfBirth: '2000-01-15', enrollmentNumber: '20230001', phone: '123456789', address: 'Rua A' },
  { id: 2, name: 'Maria Oliveira', email: 'maria.oliveira@email.com', dateOfBirth: '2001-03-22', enrollmentNumber: '20230002', phone: '987654321', address: 'Rua B' },
  { id: 3, name: 'Pedro Santos', email: 'pedro.santos@email.com', dateOfBirth: '1999-07-10', enrollmentNumber: '20230003', phone: '111222333', address: 'Rua C' },
  { id: 4, name: 'Ana Costa', email: 'ana.costa@email.com', dateOfBirth: '2002-05-05', enrollmentNumber: '20230004', phone: '444555666', address: 'Rua D' },
  { id: 5, name: 'Carlos Souza', email: 'carlos.souza@email.com', dateOfBirth: '2000-12-30', enrollmentNumber: '20230005', phone: '777888999', address: 'Rua E' },
];

export const students: Student[] = mockStudents;
