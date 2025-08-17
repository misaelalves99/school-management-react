// src/types/enrollmentDetails.ts

export interface EnrollmentDetails {
  id: number;
  studentName: string | null;
  classRoomName: string | null;
  enrollmentDate: string;
  status: string;
}
