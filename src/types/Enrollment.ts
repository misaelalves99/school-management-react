// src/types/Enrollment.ts

export interface Enrollment {
  id: number;
  studentId: number;
  classRoomId: number;
  enrollmentDate: string; 
  status: string;
}

// Versão com nomes de aluno e turma
export interface EnrollmentWithNames extends Enrollment {
  studentName: string;
  classRoomName: string;
}
