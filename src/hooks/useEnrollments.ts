// src/hooks/useEnrollments.ts

import { useContext } from "react";
import { EnrollmentsContext, EnrollmentsContextType } from "../contexts/Enrollments/EnrollmentsContext";

export function useEnrollments(): EnrollmentsContextType {
  const context = useContext(EnrollmentsContext);
  if (!context) throw new Error("useEnrollments deve ser usado dentro de um EnrollmentsProvider");
  return context;
}
