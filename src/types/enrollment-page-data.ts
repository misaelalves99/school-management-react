// src/types/enrollmentPageData.ts

import type { EnrollmentWithNames } from './enrollment-with-names';

export interface EnrollmentPageData {
  items: EnrollmentWithNames[];
  currentPage: number;
  totalItems: number;
  pageSize: number;
  searchTerm: string;
}
