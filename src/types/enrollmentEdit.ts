// src/types/EnrollmentEdit.ts

// export interface EnrollmentEdit {
//   id: number;
//   studentId: number;
//   classRoomId: number;
//   enrollmentDate: string;
//   status: string;
// }

export interface EnrollmentEdit {
  id: number;
  studentId?: number;
  classRoomId?: number;
  enrollmentDate?: string;
  status?: string;
}
