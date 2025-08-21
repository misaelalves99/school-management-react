// src/types/enrollmentPageData.ts
import type { Enrollment } from './Enrollment';

export interface EnrollmentWithNames extends Enrollment {
  studentName: string;
  classRoomName: string;
}

export interface EnrollmentPageData {
  items: EnrollmentWithNames[];
  currentPage: number;
  totalItems: number;
  pageSize: number;
  searchTerm: string;
}
