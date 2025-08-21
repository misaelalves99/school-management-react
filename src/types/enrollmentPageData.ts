// src/types/enrollmentPageData.ts

import type { EnrollmentWithNames } from './EnrollmentWithNames';

export interface EnrollmentPageData {
  items: EnrollmentWithNames[];
  currentPage: number;
  totalItems: number;
  pageSize: number;
  searchTerm: string;
}
