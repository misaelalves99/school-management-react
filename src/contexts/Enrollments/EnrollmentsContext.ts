// src/contexts/Enrollments/EnrollmentsContext.tsx

import { createContext } from "react";
import type { Enrollment } from "../../types/Enrollment";
import type { EnrollmentFormData } from "../../types/EnrollmentForm";
import type { EnrollmentEdit } from "../../types/EnrollmentEdit";

export interface EnrollmentsContextType {
  enrollments: Enrollment[];
  refresh: () => void;
  createEnrollment: (data: EnrollmentFormData) => Promise<Enrollment>;
  updateEnrollment: (data: EnrollmentEdit) => Promise<Enrollment | null>;
  removeEnrollment: (id: number) => void;
}

export const EnrollmentsContext = createContext<EnrollmentsContextType | undefined>(undefined);
