// src/types/EnrollmentWithNames.ts

import type { Enrollment } from './Enrollment';

export interface EnrollmentWithNames extends Enrollment {
  studentName: string;
  classRoomName: string;
}
