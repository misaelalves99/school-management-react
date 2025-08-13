// /src/mocks/classRooms.ts

import type { ClassRoom } from '../types/Classroom';

const mockClassRooms: ClassRoom[] = [
  {
    id: 1,
    name: 'Sala A',
    capacity: 30,
    schedule: 'Seg - 08:00 às 10:00',
    subjects: [{ name: 'Matemática' }, { name: 'Português' }],
    teachers: [{ name: 'Maria Silva' }, { name: 'João Souza' }],
    classTeacher: { name: 'Maria Silva' },
  },
  {
    id: 2,
    name: 'Sala B',
    capacity: 25,
    schedule: 'Ter - 10:00 às 12:00',
    subjects: [{ name: 'História' }],
    teachers: [{ name: 'Carlos Pereira' }],
    classTeacher: { name: 'Carlos Pereira' },
  },
  {
    id: 3,
    name: 'Sala C',
    capacity: 20,
    schedule: 'Qua - 13:00 às 15:00',
    subjects: [],
    teachers: [],
    classTeacher: null,
  },
];

export default mockClassRooms;
