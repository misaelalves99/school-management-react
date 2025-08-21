// src/types/enrollmentDetails.ts

import type { Enrollment } from './Enrollment';


export interface EnrollmentDetails extends Enrollment {
  id: number;
  studentName: string;
  classRoomName: string;
  enrollmentDate: string;
  status: string;
}
