// src/types/Classroom.ts

export interface Subject {
  name: string;
}

export interface Teacher {
  name: string;
}

export interface ClassRoom {
  id: number;
  name: string;
  capacity: number;
  schedule: string; // obrigatório
  subjects?: Subject[];
  teachers?: Teacher[];
  classTeacher?: Teacher | null;
}
