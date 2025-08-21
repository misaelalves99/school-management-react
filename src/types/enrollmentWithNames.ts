// src/types/EnrollmentWithNames.ts

import type { EnrollmentFormData } from './EnrollmentForm';

export interface EnrollmentWithNames extends EnrollmentFormData {
  id: number;
  studentName: string;
  classRoomName: string;
}
