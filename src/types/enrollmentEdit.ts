// src/types/enrollmentEdit.ts

export interface EnrollmentEdit {
  id: number;
  studentId: number;
  classRoomId: number;
  enrollmentDate: string; // ISO date string
  status: string;
}
