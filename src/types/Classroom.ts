// src/mocks/classRooms.ts

import type { ClassRoom } from '../types/ClassRoom';
import type { Subject } from '../types/Subject';
import type { Teacher } from '../types/Teacher';

// Dados iniciais
const classRoomsData: ClassRoom[] = [
  {
    id: 1,
    name: 'Sala A',
    capacity: 30,
    schedule: 'Seg - 08:00 às 10:00',
    subjects: [
      { id: 1, name: 'Matemática', description: 'Matemática básica', workloadHours: 40 },
      { id: 2, name: 'Português', description: 'Português avançado', workloadHours: 35 },
    ] as Subject[],
    teachers: [
      { id: 1, name: 'Maria Silva', email: 'maria@email.com', dateOfBirth: '1980-01-01', subject: 'Matemática', phone: '123456789', address: 'Rua A' },
      { id: 2, name: 'João Souza', email: 'joao@email.com', dateOfBirth: '1975-05-20', subject: 'Português', phone: '987654321', address: 'Rua B' },
    ] as Teacher[],
    classTeacher: { id: 1, name: 'Maria Silva', email: 'maria@email.com', dateOfBirth: '1980-01-01', subject: 'Matemática', phone: '123456789', address: 'Rua A' } as Teacher,
  },
  {
    id: 2,
    name: 'Sala B',
    capacity: 25,
    schedule: 'Ter - 10:00 às 12:00',
    subjects: [
      { id: 3, name: 'História', description: 'História do Brasil', workloadHours: 30 },
    ] as Subject[],
    teachers: [
      { id: 3, name: 'Carlos Pereira', email: 'carlos@email.com', dateOfBirth: '1978-02-10', subject: 'História', phone: '111222333', address: 'Rua C' },
    ] as Teacher[],
    classTeacher: { id: 3, name: 'Carlos Pereira', email: 'carlos@email.com', dateOfBirth: '1978-02-10', subject: 'História', phone: '111222333', address: 'Rua C' } as Teacher,
  },
];

// Função para gerar próximo ID
const getNextId = (): number => {
  return classRoomsData.length > 0 ? Math.max(...classRoomsData.map(c => c.id)) + 1 : 1;
};

// Mock completo em memória
export const mockClassRooms = {
  list: (): ClassRoom[] => [...classRoomsData],

  get: (id: number): ClassRoom | undefined => classRoomsData.find(c => c.id === id),

  create: (classRoom: Omit<ClassRoom, 'id'>): ClassRoom => {
    const newClassRoom: ClassRoom = { id: getNextId(), ...classRoom };
    classRoomsData.push(newClassRoom);
    return newClassRoom;
  },

  update: (id: number, updated: Partial<Omit<ClassRoom, 'id'>>): ClassRoom | undefined => {
    const index = classRoomsData.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    classRoomsData[index] = { ...classRoomsData[index], ...updated };
    return classRoomsData[index];
  },

  delete: (id: number): boolean => {
    const index = classRoomsData.findIndex(c => c.id === id);
    if (index === -1) return false;
    classRoomsData.splice(index, 1);
    return true;
  }
};
