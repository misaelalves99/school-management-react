// src/types/EnrollmentWithNames.ts

import type { EnrollmentFormData } from './enrollment-form';

export interface EnrollmentWithNames extends EnrollmentFormData {
  id: number;
  studentName: string;
  classRoomName: string;
}
