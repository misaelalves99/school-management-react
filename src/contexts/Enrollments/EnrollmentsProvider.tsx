// src/contexts/Enrollments/EnrollmentsProvider.tsx

import { ReactNode, useCallback, useState } from "react";
import { EnrollmentsContext } from "./EnrollmentsContext";
import type { Enrollment } from "../../types/Enrollment";
import type { EnrollmentFormData } from "../../types/EnrollmentForm";
import type { EnrollmentEdit } from "../../types/EnrollmentEdit";
import {
  getEnrollments as getMockEnrollments,
  createEnrollment as createMockEnrollment,
  updateEnrollment as updateMockEnrollment,
  deleteEnrollment as deleteMockEnrollment,
} from "../../mocks/Enrollments";

interface Props {
  children: ReactNode;
}

export const EnrollmentsProvider: React.FC<Props> = ({ children }) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(getMockEnrollments());

  const refresh = useCallback(() => {
    setEnrollments(getMockEnrollments());
  }, []);

  const createEnrollment = useCallback(async (data: EnrollmentFormData) => {
    const newEnrollment = createMockEnrollment({
      studentId: Number(data.studentId),
      classRoomId: Number(data.classRoomId),
      enrollmentDate: data.enrollmentDate,
      status: data.status,
    });
    refresh();
    return newEnrollment;
  }, [refresh]);

  const updateEnrollment = useCallback(async (data: EnrollmentEdit) => {
    const updated = updateMockEnrollment(data.id, data);
    refresh();
    return updated;
  }, [refresh]);

  const removeEnrollment = useCallback((id: number) => {
    deleteMockEnrollment(id);
    refresh();
  }, [refresh]);

  return (
    <EnrollmentsContext.Provider
      value={{ enrollments, refresh, createEnrollment, updateEnrollment, removeEnrollment }}
    >
      {children}
    </EnrollmentsContext.Provider>
  );
};
