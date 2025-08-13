// src/types/enrollmentWithNames.ts

import type { Enrollment } from './enrollment';

export interface EnrollmentWithNames extends Enrollment {
  studentName: string;
  classRoomName: string;
}
